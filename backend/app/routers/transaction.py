import logging

from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from app.db import get_db
from app.globals.enums import (
	ResponseError,
	RouterPrefix,
	RouterTag,
	TransactionFailureReason,
	TransactionStatus,
)
from app.models import BankAccount, Transaction
from app.schemas import TransactionCreate
from app.schemas.transaction import TransactionResponse
from app.services.idempotency import (
	get_existing_response,
	get_idempotency_key,
	save_response,
)
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
		return JSONResponse(
			status_code=existing.status_code,
			content=existing.response_body,
		)

	try:
		with db.begin():
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

			if sender.balance < value.amount:
				status = TransactionStatus.FAILURE.value
				failure_reason = TransactionFailureReason.LOW_BALANCE.value
			else:
				status = TransactionStatus.SUCCESSFUL.value
				failure_reason = None

			if status == TransactionStatus.SUCCESSFUL.value:
				sender.balance -= value.amount
				receiver.balance += value.amount

			transaction = Transaction(
				sender_account_number=sender.account_number,
				receiver_account_number=receiver.account_number,
				amount_transferred=value.amount,
				status=status,
				failure_reason=failure_reason,
			)

			db.add(transaction)

			response = build_transaction_response(
				transaction, sender, receiver
			).model_dump()

			save_response(
				db=db,
				key=idempotency_key,
				endpoint=endpoint,
				response_body=response,
				status_code=200,
			)

		return response

	except SQLAlchemyError:
		db.rollback()
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
