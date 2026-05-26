from fastapi import Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.account_pin import AccountPinDependencies
from app.dependencies.bank_account import BankAccountDependencies
from app.dependencies.idempotency import IdempotencyDependencies
from app.dependencies.payment_intent import PaymentIntentDependencies
from app.repository.transaction import TransactionRepository
from app.services.account_pin import AccountPinService
from app.services.bank_account import BankAccountService
from app.services.idempotency import IdempotencyService
from app.services.payment_intent import PaymentIntentService
from app.services.transaction import TransactionService


class TranasctionDependencies:
	@staticmethod
	def __get_repository__(db: Session = Depends(get_db)):
		return TransactionRepository(db)

	@staticmethod
	def get_service(
		repository: TransactionRepository = Depends(__get_repository__),
		intent_service: PaymentIntentService = Depends(
			PaymentIntentDependencies.get_service
		),
		account_service: BankAccountService = Depends(
			BankAccountDependencies.get_service
		),
		pin_service: AccountPinService = Depends(AccountPinDependencies.get_service),
		idempotency_service: IdempotencyService = Depends(
			IdempotencyDependencies.get_service
		),
	):
		return TransactionService(
			repository,
			intent_service,
			account_service,
			pin_service,
			idempotency_service,
		)
