import random
from decimal import Decimal

from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import RouterPrefix, RouterTag
from app.models import Bank, BankAccount
from app.schemas.bank_account import AccountCreate, AccountUpdate

router = APIRouter(prefix=RouterPrefix.ACCOUNTS.value, tags=[RouterTag.ACCOUNTS.value])


@router.post("/")
def create_account(value: AccountCreate, db: Session = Depends(get_db)):
	if value.bank_id:
		bank = db.query(Bank).filter(Bank.id == value.bank_id).first()
	else:
		bank = db.query(Bank).filter(Bank.name == value.bank_name).first()

	if not bank:
		raise HTTPException(status_code=404, detail="Bank not found")

	# Generate unique account number
	while True:
		account_number = str(random.randint(10_000_000_000, 99_999_999_999))
		if (
			not db.query(BankAccount)
			.filter(BankAccount.account_number == account_number)
			.first()
		):
			break

	account = BankAccount(
		account_number=account_number,
		owner_name=value.owner_name,
		balance=Decimal("500.00"),
		bank_id=bank.id,
		is_active=value.is_active if value.is_active is not None else True,
	)

	db.add(account)
	db.commit()
	db.refresh(account)

	return account


@router.get("/")
def get_accounts_list(db: Session = Depends(get_db)):
	return db.query(BankAccount).all()


@router.get("/{account_id}")
def get_account(account_id: int, db: Session = Depends(get_db)):
	account = db.query(BankAccount).filter(BankAccount.id == account_id).first()
	if not account:
		raise HTTPException(status_code=404, detail="Account not found")
	return account


@router.put("/{account_id}")
def update_account(
	account_id: int, account_update: AccountUpdate, db: Session = Depends((get_db))
):
	account = db.query(BankAccount).filter(BankAccount.id == account_id).first()
	if not account:
		raise HTTPException(status_code=404, detail="Account not found")

	if account_update.owner_name:
		account.owner_name = account.update_owner_name

	return account
