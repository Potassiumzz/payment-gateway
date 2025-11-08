from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import ResponseError, RouterPrefix, RouterTag
from app.models import Bank
from app.schemas.bank import BankCreate, BankResponse

router = APIRouter(prefix=RouterPrefix.BANKS.value, tags=[RouterTag.BANKS.value])


@router.post("/", response_model=BankResponse, description="Create a new bank.")
def create_bank(value: BankCreate, db: Session = Depends(get_db)):
	existing = db.query(Bank).filter(Bank.name == value.name).first()

	if existing:
		raise HTTPException(status_code=400, detail=ResponseError.RESOURCE_EXISTS.value)

	bank = Bank(name=value.name)
	db.add(bank)
	db.commit()
	db.refresh(bank)
	return bank


@router.get(
	"/",
	response_model=list[BankResponse],
	description="Get a list of all banks.",
)
def get_banks_list(db: Session = Depends(get_db)):
	return db.query(Bank).all()


@router.get(
	"/{bank_id}",
	response_model=BankResponse,
	description="Get a bank by its ID.",
)
def get_bank(bank_id: int, db: Session = Depends(get_db)):
	bank = db.query(Bank).get(bank_id)

	if not bank:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)
	return bank


@router.put(
	"/{bank_id}", response_model=BankResponse, description="Update a bank by its ID."
)
def update_bank(bank_id: int, bank: BankCreate, db: Session = Depends(get_db)):
	bank_to_be_updated = db.query(Bank).filter(Bank.id == bank_id).first()

	if not bank_to_be_updated:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	if db.query(Bank).filter(Bank.name == bank.name, Bank.id != bank_id).first():
		raise HTTPException(status_code=400, detail=ResponseError.RESOURCE_EXISTS.value)

	bank_to_be_updated.name = bank.name

	db.commit()
	db.refresh(bank_to_be_updated)
	return bank_to_be_updated


@router.delete(
	"/{bank_id}", status_code=204, description="Delete an existing bank by its ID"
)
def delete_bank(bank_id: int, db: Session = Depends(get_db)):
	bank_to_be_deleted = db.query(Bank).filter(Bank.id == bank_id).first()

	if not bank_to_be_deleted:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	db.delete(bank_to_be_deleted)
	db.commit()
	return
