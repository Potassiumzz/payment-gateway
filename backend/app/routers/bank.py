from fastapi import Depends
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.bank import Bank

router = APIRouter()


@router.post("/create-bank")
def create_bank(name: str, db: Session = Depends(get_db)):
	bank = Bank(name=name)
	db.add(bank)
	db.commit()
	db.refresh(bank)
	return bank
