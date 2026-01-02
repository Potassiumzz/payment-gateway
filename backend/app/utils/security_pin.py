from datetime import UTC, datetime, timedelta

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models import AccountPin, BankAccount

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_ATTEMPTS = 3
LOCK_TIME = timedelta(minutes=15)


def hash_pin(pin: str) -> str:
	return pwd_context.hash(pin)


def verify_pin(pin: str, pin_hash: str) -> bool:
	return pwd_context.verify(pin, pin_hash)


def validate_account_pin(
	db: Session,
	account: BankAccount,
	pin: str,
) -> None:
	pin_record = (
		db.query(AccountPin).filter(AccountPin.bank_account_id == account.id).first()
	)

	if not pin_record:
		raise HTTPException(
			status_code=500, detail="PIN record missing for the account."
		)

	now = datetime.now(UTC)

	if pin_record.locked_until and pin_record.locked_until > now:
		raise HTTPException(
			status_code=403,
			detail="Account temporarily locked due to failed PIN attempts",
		)

	if not verify_pin(pin, pin_record.pin_hash):
		if pin_record.failed_attempts >= MAX_ATTEMPTS:
			pin_record.locked_until = now + LOCK_TIME

		pin_record.failed_attempts += 1

		db.commit()
		raise HTTPException(status_code=401, detail="Invalid PIN")

	# success path
	pin_record.failed_attempts = 0
	pin_record.locked_until = None
	db.commit()
	db.refresh(pin_record)
