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
