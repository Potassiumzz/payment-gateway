from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import RouteDescriptions, RouterPrefix, RouterTag
from app.models import Bank
from app.schemas.bank import BankCreate, BankResponse

router = APIRouter(prefix=RouterPrefix.BANKS.value, tags=[RouterTag.BANKS.value])


@router.post(
	"/", response_model=BankResponse, description=RouteDescriptions.CREATE_BANK.value
)
def create_bank(value: BankCreate, db: Session = Depends(get_db)):
	existing = db.query(Bank).filter(Bank.name == value.name).first()

	if existing:
		raise HTTPException(
			status_code=400, detail=f"'{value.name}' bank already exists"
		)

	bank = Bank(name=value.name)
	db.add(bank)
	db.commit()
	db.refresh(bank)
	return bank


@router.get(
	"/",
	response_model=list[BankResponse],
	description=RouteDescriptions.GET_ALL_BANKS.value,
)
def get_banks_list(db: Session = Depends(get_db)):
	return db.query(Bank).all()


@router.get(
	"/{bank_id}",
	response_model=BankResponse,
	description=RouteDescriptions.GET_BANK.value,
)
def get_bank(bank_id: int, db: Session = Depends(get_db)):
	bank = db.query(Bank).get(bank_id)

	if not bank:
		raise HTTPException(
			status_code=404, detail="Provided id does not exist for banks"
		)
	return bank


@router.put("/{bank_id}")
def update_bank(bank_id: int, bank: BankCreate, db: Session = Depends(get_db)):
	bank_to_be_updated = db.query(Bank).filter(Bank.id == bank_id).first()

	if not bank_to_be_updated:
		raise HTTPException(status_code=404, detail="Bank not found")

	if db.query(Bank).filter(Bank.name == bank.name, Bank.id != bank_id).first():
		raise HTTPException(status_code=400, detail="Bank name already exists")

	bank_to_be_updated.name = bank.name

	db.commit()
	db.refresh(bank_to_be_updated)
	return bank_to_be_updated


@router.delete(
	"/{bank_id}", status_code=204, description=RouteDescriptions.DELETE_BANK.value
)
def delete_bank(bank_id: int, db: Session = Depends(get_db)):
	bank_to_be_deleted = db.query(Bank).filter(Bank.id == bank_id).first()

	if not bank_to_be_deleted:
		raise HTTPException(status_code=404, detail="Bank not found")

	db.delete(bank_to_be_deleted)
	db.commit()
	return
