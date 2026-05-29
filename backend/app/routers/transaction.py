import logging

from fastapi import Depends
from fastapi.routing import APIRouter

from app.dependencies.transaction import TranasctionDependencies
from app.globals.enums import (
	RouterPrefix,
	RouterTag,
)
from app.schemas import TransactionCreate
from app.schemas.transaction import TransactionResponse
from app.services.transaction import TransactionService
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
	idempotency_key: str,
	service: TransactionService = Depends(TranasctionDependencies.get_service),
):
	return service.create(value, idempotency_key)


@router.get("/", response_model=list[TransactionResponse])
def get_all_transactions(
	service: TransactionService = Depends(TranasctionDependencies.get_service),
):
	transactions = service.get_all()

	responses: list[TransactionResponse] = []

	for t in transactions:
		sender = t.sender_account
		receiver = t.receiver_account

		if sender is None or receiver is None:
			continue

		responses.append(build_transaction_response(t, sender, receiver))

	return responses


@router.get(
	"/{transaction_id}",
	response_model=TransactionResponse,
	description="Get transaction(s) by transaction ID. It can be used to find a transaction's details.",
)
def get_transaction_by_id(
	transaction_id: int,
	service: TransactionService = Depends(TranasctionDependencies.get_service),
):
	transaction = service.get_by_id(transaction_id)
	return build_transaction_response(
		transaction, transaction.sender_account, transaction.receiver_account
	)


@router.delete(
	"/{transaction_id}",
	status_code=204,
	description="Delete the transaction permanently. Use this API only when testing during development if needed. This API will not made public.",
)
def delete_transaction(
	transaction_id: int,
	service: TransactionService = Depends(TranasctionDependencies.get_service),
):
	service.delete(transaction_id)
