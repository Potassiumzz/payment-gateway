import logging

from fastapi import Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.routing import APIRouter
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.constants import MAX_PAYMENT_INTENT_ATTEMPT
from app.globals.enums import (
	PaymentIntentStatus,
	ResponseError,
	RouterPrefix,
	RouterTag,
	TransactionFailureReason,
	TransactionStatus,
)
from app.models import BankAccount, Transaction
from app.models.payment_intent import PaymentIntent
from app.schemas import TransactionCreate
from app.schemas.transaction import TransactionResponse
from app.services.idempotency import (
	get_existing_response,
	get_idempotency_key,
	save_response,
)
from app.utils.security_pin import validate_account_pin
from app.utils.transaction import build_transaction_response

router = APIRouter(
	prefix=RouterPrefix.TRANSACTIONS.value, tags=[RouterTag.TRANSACTIONS.value]
)

logger = logging.getLogger(__name__)


@router.post(
	"/",
	response_model=TransactionResponse,
	description="Create a transaction. This represents when a transaction has occured between two accounts successfully.",
)
def create_transaction(
	value: TransactionCreate,
	db: Session = Depends(get_db),
	idempotency_key: str = Depends(get_idempotency_key),
):
	endpoint = RouterPrefix.TRANSACTIONS.value

	existing = get_existing_response(db, idempotency_key, endpoint)

	if existing:
		return existing.response_body

	try:
		intent = (
			db.query(PaymentIntent)
			.filter(PaymentIntent.id == value.payment_intent_id)
			.first()
		)

		if not intent:
			raise HTTPException(
				status_code=404,
				detail=f"{ResponseError.RESOURCE_NOT_FOUND.value}: Intent ID not found",
			)

		if intent.status != PaymentIntentStatus.REQUIRES_PAYMENT:
			raise HTTPException(
				status_code=400,
				detail=f"{ResponseError.BAD_REQUEST.value}: Invalid intent state",
			)

		sender = (
			db.query(BankAccount)
			.filter(BankAccount.account_number == value.sender_account_number)
			.first()
		)

		if not sender:
			raise HTTPException(
				status_code=404,
				detail=f"{ResponseError.RESOURCE_NOT_FOUND.value} {TransactionFailureReason.SENDER_NOT_FOUND.value}",
			)

		validate_account_pin(db=db, account=sender, pin=value.security_pin)

		receiver = (
			db.query(BankAccount)
			.filter(BankAccount.account_number == value.receiver_account_number)
			.first()
		)

		if not receiver:
			raise HTTPException(
				status_code=404,
				detail=f"{ResponseError.RESOURCE_NOT_FOUND.value} {TransactionFailureReason.RECEIVER_NOT_FOUND.value}",
			)

		if sender.account_number == receiver.account_number:
			raise HTTPException(
				status_code=400,
				detail=f"{ResponseError.BAD_REQUEST.value} {TransactionFailureReason.SELF_TRANSFER.value}",
			)

		amount = intent.amount

		if sender.balance < amount:
			status = TransactionStatus.FAILURE
			failure_reason = TransactionFailureReason.LOW_BALANCE.value
		else:
			status = TransactionStatus.SUCCESSFUL
			failure_reason = None

		if status is TransactionStatus.SUCCESSFUL:
			sender.balance -= amount
			receiver.balance += amount
			intent.status = PaymentIntentStatus.SUCCEEDED

		if intent.attempt_count >= MAX_PAYMENT_INTENT_ATTEMPT:
			intent.status = PaymentIntentStatus.FAILED

		intent.attempt_count += 1

		transaction = Transaction(
			sender_account_number=sender.account_number,
			receiver_account_number=receiver.account_number,
			amount_transferred=amount,
			status=status,
			failure_reason=failure_reason,
		)

		db.add(transaction)
		db.flush()

		response = jsonable_encoder(
			build_transaction_response(transaction, sender, receiver)
		)

		save_response(
			db=db,
			key=idempotency_key,
			endpoint=endpoint,
			response_body=response,
			status=status,
			failure_reason=failure_reason,
		)

		db.commit()
		return response

	except SQLAlchemyError:
		logger.exception("Transaction failed")
		raise HTTPException(status_code=500, detail="Transaction failed") from None


@router.get("/")
def get_all_transactions(db: Session = Depends(get_db)):
	return db.query(Transaction).all()


@router.get(
	"/{account_number}",
	description="Get transaction(s) by account ID. It can be used to show the transactions related to an account.",
)
def get_transaction_by_account(account_id: int, db: Session = Depends(get_db)):
	account = (
		db.query(BankAccount).filter(BankAccount.account_number == account_id).first()
	)

	if not account:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	return account


@router.get(
	"/{transaction_id}",
	description="Get transaction(s) by transaction ID. It can be used to find a transaction's details.",
)
def get_transaction_by_id(transaction_id: int, db: Session = Depends(get_db)):
	transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

	if not transaction:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	return transaction


@router.delete(
	"/{transaction_id}",
	status_code=204,
	description="Delete the transaction permanently. Use this API only when testing during development if needed. This API will not made public.",
)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
	transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

	if not transaction:
		raise HTTPException(
			status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value
		)

	db.delete(transaction)
	db.commit()
	return
