from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import RouterPrefix, RouterTag
from app.models.bank import Bank
from app.schemas.bank import BankCreate, BankResponse

router = APIRouter(prefix=RouterPrefix.BANKS.value, tags=[RouterTag.BANKS.value])


@router.post("/", response_model=BankResponse)
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


@router.get("/", response_model=list[BankResponse])
def get_banks_list(db: Session = Depends(get_db)):
	return db.query(Bank).all()


@router.get("/{bank_id}", response_model=BankResponse)
def get_bank(bank_id: int, db: Session = Depends(get_db)):
	bank = db.query(Bank).get(bank_id)

	if not bank:
		raise HTTPException(
			status_code=404, detail="Provided id does not exist for banks"
		)
	return bank


@router.delete("/{bank_id}", status_code=204)
def delete_bank(bank_id: int, db: Session = Depends(get_db)):
	bank_to_be_deleted = db.query(Bank).filter(Bank.id == bank_id).first()

	if not bank_to_be_deleted:
		raise HTTPException(status_code=404, detail="Bank not found")

	db.delete(bank_to_be_deleted)
	db.commit()
	return
