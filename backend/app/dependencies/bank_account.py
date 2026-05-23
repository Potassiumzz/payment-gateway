from fastapi import Depends
from sqlalchemy.orm.session import Session

from app.db import get_db
from app.dependencies.bank import BankDependencies
from app.repository.bank_account import BankAccountRepository
from app.services.bank import BankService
from app.services.bank_account import BankAccountService


class BankAccountDependencies:
	@staticmethod
	def __get_repository__(db: Session = Depends(get_db)):
		return BankAccountRepository(db)

	@staticmethod
	def get_service(
		repository: BankAccountRepository = Depends(__get_repository__),
		bank_service: BankService = Depends(BankDependencies.get_service),
	):
		return BankAccountService(repository, bank_service)
