import logging

from sqlalchemy.exc import SQLAlchemyError

from app.globals.constants import MAX_PAYMENT_INTENT_ATTEMPT
from app.globals.enums import (
	PaymentIntentStatus,
	RouterPrefix,
	TransactionFailureReason,
	TransactionStatus,
)
from app.models.transaction import Transaction
from app.repository.transaction import TransactionRepository
from app.schemas.transaction import TransactionCreate
from app.services.account_pin import AccountPinService
from app.services.bank_account import BankAccountService
from app.services.idempotency import IdempotencyService
from app.services.payment_intent import PaymentIntentService
from app.utils.utils import raise_400_error, raise_404_error, raise_500_error

logger = logging.getLogger(__name__)


class TransactionService:
	def __init__(
		self,
		repository: TransactionRepository,
		intent_service: PaymentIntentService,
		account_service: BankAccountService,
		pin_service: AccountPinService,
		idempotency_service: IdempotencyService,
	) -> None:
		self.repository = repository
		self.intent_service = intent_service
		self.account_service = account_service
		self.pin_service = pin_service
		self.idempotency_service = idempotency_service

	def create(
		self,
		value: TransactionCreate,
		idempotency_key: str,
	) -> Transaction | None:
		endpoint = RouterPrefix.TRANSACTIONS.value

		existing = self.idempotency_service.get_existing_response(
			idempotency_key, endpoint
		)

		if existing:
			return existing.response_body

		try:
			intent = self.intent_service.get_intent_details(value.payment_intent_id)

			if not intent:
				raise_404_error()

			if intent.status != PaymentIntentStatus.REQUIRES_PAYMENT:
				raise_404_error()

			sender = self.account_service.get_by_id(value.sender_account_number)

			if not sender:
				raise_404_error()

			self.pin_service.validate_account_pin(sender, value.security_pin)

			receiver = self.account_service.get_by_id(value.receiver_account_number)
			if not receiver:
				raise_404_error()

			if sender.account_number == receiver.account_number:
				raise_400_error()

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
				payment_intent_id=intent.id,
				sender_account_number=sender.account_number,
				receiver_account_number=receiver.account_number,
				amount_transferred=amount,
				status=status,
				failure_reason=failure_reason,
			)

			return self.repository.create(transaction)
		except SQLAlchemyError:
			logger.exception("Transaction failed")
			raise_500_error()

	def delete(self, id: int) -> None:
		return self.repository.delete(id)

	def get_all(self) -> list[Transaction]:
		return self.repository.get_all()

	def get_by_id(self, id: int) -> Transaction:
		return self.repository.get_by_id(id)
