from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import RouterPrefix, RouterTag
from app.models import BankAccount
from app.schemas.account_pin import AccountPinValidationResponse, ValidatePinValues
from app.utils.security_pin import validate_account_pin

router = APIRouter(
	prefix=RouterPrefix.ACCOUNT_PIN.value, tags=[RouterTag.ACCOUNT_PIN.value]
)


@router.post(
	"/",
	response_model=AccountPinValidationResponse,
	description="Validate the pin of the bank account during payment. This is only supposed to be a simulation of a real system, and this route is supposed to be an API to the real bank system which then verifies the pin. Since we do not have a real bank's API, we will just simulate it.",
)
def validate_pin_endpoint(value: ValidatePinValues, db: Session = Depends(get_db)):
	account = (
		db.query(BankAccount)
		.filter(BankAccount.account_number == value.account_number)
		.first()
	)

	if not account:
		raise HTTPException(status_code=404, detail="Account not found")

	validate_account_pin(db, account, value.pin)

	return {"response_code": 0, "response_msg": "PIN valid"}
