import random
from decimal import Decimal

from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import ResponseError, RouterPrefix, RouterTag
from app.models import AccountPin, Bank, BankAccount
from app.schemas.bank_account import AccountCreate, AccountRespones, AccountUpdate
from app.utils.security_pin import hash_pin

router = APIRouter(prefix=RouterPrefix.ACCOUNTS.value, tags=[RouterTag.ACCOUNTS.value])


@router.post(
	"/", response_model=AccountRespones, description="Create a new bank account."
)
def create_account(value: AccountCreate, db: Session = Depends(get_db)):
	bank = db.query(Bank).filter(Bank.id == value.bank_id).first()

	if not bank:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	# Generate unique account number
	while True:
		account_number = random.randint(10_000_000_000, 99_999_999_999)
		if (
			not db.query(BankAccount)
			.filter(BankAccount.account_number == account_number)
			.first()
		):
			break

	try:
		account = BankAccount(
			account_number=account_number,
			owner_name=value.owner_name,
			bank_id=bank.id,
			balance=Decimal("500.00"),
			is_active=True,
		)

		db.add(account)
		db.flush()
		db.commit()

		account_pin = AccountPin(
			bank_account_id=account.id,
			pin_hash=hash_pin(value.pin),
			failed_attempts=0,
			locked_until=None,
		)

		db.add(account_pin)
		db.commit()
	except Exception:
		db.rollback()
		raise

	db.refresh(account)

	return {
		"account_number": account.account_number,
		"owner_name": account.owner_name,
		"bank_id": account.bank_id,
		"bank_name": account.bank.name,
		"balance": account.balance,
		"is_active": account.is_active,
	}


@router.get("/")
def get_accounts_list(db: Session = Depends(get_db)):
	return db.query(BankAccount).all()


@router.get("/{account_id}")
def get_account(account_id: int, db: Session = Depends(get_db)):
	account = db.query(BankAccount).filter(BankAccount.id == account_id).first()
	if not account:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)
	return account


@router.put("/{account_id}")
def update_account(
	account_id: int, account_update: AccountUpdate, db: Session = Depends((get_db))
):
	account = db.query(BankAccount).filter(BankAccount.id == account_id).first()
	if not account:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	if (
		db.query(BankAccount)
		.filter(BankAccount.owner_name == account_update.owner_name)
		.first()
	):
		raise HTTPException(status_code=400, detail=ResponseError.RESOURCE_EXISTS.value)

	if account_update.owner_name:
		account.owner_name = account_update.owner_name

	db.commit()
	db.refresh(account)

	return account


@router.delete(
	"/{account_id}",
	status_code=204,
	description="Soft delete the account by making the account's status inactive, rather than deleting the account from database.",
)
def delete_account(account_id: int, db: Session = Depends((get_db))):
	account_delete = db.query(BankAccount).filter(BankAccount.id == account_id).first()

	if not account_delete:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	account_delete.is_active = False
	db.commit()
	return


@router.delete(
	"/{account_id}/hard",
	status_code=204,
	description="Delete the account permanently from the database. Only use this while testing during development.",
)
def hard_delete(account_id: int, db: Session = Depends((get_db))):
	account_delete = db.query(BankAccount).filter(BankAccount.id == account_id).first()

	if not account_delete:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	db.delete(account_delete)
	db.commit()
	return
