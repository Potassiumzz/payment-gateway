from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import ResponseError, RouterPrefix, RouterTag
from app.models import BankAccount, Transaction
from app.schemas import TransactionCreate
from app.schemas.transaction import TransactionResponse

router = APIRouter(
	prefix=RouterPrefix.TRANSACTIONS.value, tags=[RouterTag.TRANSACTIONS.value]
)


@router.post("/", response_model=TransactionResponse)
def create_transaction(value: TransactionCreate, db: Session = Depends(get_db)):
	sender = (
		db.query(BankAccount)
		.filter(BankAccount.account_number == value.sender_account_number)
		.first()
	)

	if not sender:
		raise HTTPException(
			status_code=404,
			detail=f"{ResponseError.RESOURCE_NOT_FOUND.value} (Sender not found)",
		)

	receiver = (
		db.query(BankAccount)
		.filter(BankAccount.account_number == value.receiver_account_number)
		.first()
	)

	if not receiver:
		raise HTTPException(
			status_code=404,
			detail=f"{ResponseError.RESOURCE_NOT_FOUND.value} (Receiver not found)",
		)

	if sender.account_number == receiver.account_number:
		raise HTTPException(
			status_code=400,
			detail=f"{ResponseError.BAD_REQUEST.value} (Cannot transfer money to yourself!)",
		)

	transaction = Transaction(
		sender_account_id=sender.id,
		receiver_account_id=receiver.id,
		amount_transferred=value.amount,
	)

	if sender.balance < value.amount:
		raise HTTPException(
			status_code=400,
			detail=f"{ResponseError.BAD_REQUEST.value} (Not enough balance.)",
		)

	sender.balance -= value.amount
	receiver.balance += value.amount

	db.add(transaction)
	db.commit()
	db.refresh(transaction)

	return {
		"id": transaction.id,
		"sender_account_number": sender.account_number,
		"sender_owner_name": sender.owner_name,
		"sender_bank_name": sender.bank.name,
		"receiver_account_number": receiver.account_number,
		"receiver_owner_name": receiver.owner_name,
		"receiver_bank_name": receiver.bank.name,
		"amount_transferred": transaction.amount_transferred,
		"timestamp": transaction.timestamp,
	}
