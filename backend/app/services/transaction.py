import logging
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy.exc import SQLAlchemyError

from app.globals.constants import MAX_PAYMENT_INTENT_ATTEMPT
from app.globals.enums import (
	PaymentIntentStatus,
	RouterPrefix,
	TransactionFailureReason,
	TransactionStatus,
)
from app.models import BankAccount, PaymentIntent
from app.models.transaction import Transaction
from app.repository.transaction import TransactionRepository
from app.schemas import TransactionResponse
from app.schemas.idempotency import IdempotencyRequest
from app.schemas.transaction import TransactionCreate
from app.services.account_pin import AccountPinService
from app.services.bank_account import BankAccountService
from app.services.idempotency import IdempotencyService
from app.services.payment_intent import PaymentIntentService
from app.utils.http_errors import raise_400_error, raise_404_error, raise_500_error
from app.utils.transaction import build_transaction_response

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

	def _determine_status(
		self, sender: BankAccount, amount: Decimal
	) -> tuple[TransactionStatus, str | None]:
		if sender.balance < amount:
			return TransactionStatus.FAILURE, TransactionFailureReason.LOW_BALANCE.value
		return TransactionStatus.SUCCESSFUL, None

	def _apply_balance_changes(
		self,
		sender: BankAccount,
		receiver: BankAccount,
		intent: PaymentIntent,
		amount: Decimal,
		status: TransactionStatus,
	) -> None:
		if status is TransactionStatus.SUCCESSFUL:
			sender.balance -= amount
			receiver.balance += amount
			intent.status = PaymentIntentStatus.SUCCEEDED
		elif intent.attempt_count >= MAX_PAYMENT_INTENT_ATTEMPT:
			intent.status = PaymentIntentStatus.FAILED

	def _persist_transaction(
		self,
		intent: PaymentIntent,
		sender: BankAccount,
		receiver: BankAccount,
		amount: Decimal,
		status: TransactionStatus,
		failure_reason: str | None,
	) -> Transaction:
		existing_transaction = self.repository.get_by_intent_id(intent.id)

		if existing_transaction:
			existing_transaction.receiver_account_number = receiver.account_number
			existing_transaction.amount_transferred = amount
			existing_transaction.status = status.value
			existing_transaction.failure_reason = failure_reason
			existing_transaction.timestamp = datetime.now(UTC)
			return self.repository.update(existing_transaction)

		transaction = Transaction(
			payment_intent_id=intent.id,
			sender_account_number=sender.account_number,
			receiver_account_number=receiver.account_number,
			amount_transferred=amount,
			status=status.value,
			failure_reason=failure_reason,
		)
		return self.repository.create(transaction)

	def create(
		self,
		value: TransactionCreate,
		idempotency_key: str,
	) -> TransactionResponse | None:
		endpoint = RouterPrefix.TRANSACTIONS.value

		try:
			sender = self.account_service.get_by_ac_number(value.sender_account_number)

			if not sender:
				raise_404_error("Sender's account not found.")

			self.pin_service.validate_account_pin(sender, value.security_pin)

			existing = self.idempotency_service.get_existing_response(
				idempotency_key, endpoint
			)

			if existing and existing.status == TransactionStatus.SUCCESSFUL:
				return TransactionResponse.model_validate(existing.response_body)

			intent = self.intent_service.get_intent(value.payment_intent_id)

			if not intent:
				raise_404_error("Payment intent not found.")

			if intent.status != PaymentIntentStatus.REQUIRES_PAYMENT:
				raise_400_error()

			receiver = self.account_service.get_by_ac_number(
				intent.receiver_account_number or value.receiver_account_number
			)
			if not receiver:
				print("reciver")
				raise_404_error("Receiver's account not found.")

			if sender.account_number == receiver.account_number:
				raise_400_error("Self-transfer is not permitted.")

			amount = intent.amount
			status, failure_reason = self._determine_status(sender, amount)

			intent.attempt_count += 1

			self._apply_balance_changes(
				sender=sender,
				receiver=receiver,
				intent=intent,
				amount=amount,
				status=status,
			)

			transaction = self._persist_transaction(
				intent=intent,
				sender=sender,
				receiver=receiver,
				amount=amount,
				status=status,
				failure_reason=failure_reason,
			)

			transaction_response = build_transaction_response(
				transaction, sender, receiver
			)

			if existing:
				self.idempotency_service.update_response(
					existing,
					response_body=transaction_response.model_dump(mode="json"),
					status=status,
					failure_reason=failure_reason,
				)
			else:
				idempotency_data = IdempotencyRequest(
					key=idempotency_key,
					endpoint=endpoint,
					response_body=transaction_response.model_dump(mode="json"),
					status=status,
					failure_reason=failure_reason,
				)
				self.idempotency_service.save_response(idempotency_data)

			return transaction_response
		except SQLAlchemyError:
			logger.exception("Transaction failed")
			raise_500_error("Transaction failed because of some issue in the server.")

	def delete(self, id: int) -> None:
		return self.repository.delete(id)

	def get_all(self) -> list[Transaction]:
		return self.repository.get_all()

	def get_by_id(self, id: int) -> Transaction:
		return self.repository.get_by_id(id)
