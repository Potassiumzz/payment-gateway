from sqlalchemy.orm import Session

from app.repository.transaction import TransactionRepository
from app.services.account_pin import AccountPinService
from app.services.bank_account import BankAccountService
from app.services.idempotency import IdempotencyService
from app.services.payment_intent import PaymentIntentService
from app.services.transaction import TransactionService


class TranasctionDependencies:
	@staticmethod
	def __get_repository__(db: Session):
		return TransactionRepository(db)

	@staticmethod
	def get_service(
		repository: TransactionRepository,
		intent_service: PaymentIntentService,
		account_service: BankAccountService,
		pin_service: AccountPinService,
		idempotency_service: IdempotencyService,
	):
		return TransactionService(
			repository,
			intent_service,
			account_service,
			pin_service,
			idempotency_service,
		)
