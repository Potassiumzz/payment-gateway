from fastapi import Depends
from sqlalchemy.orm.session import Session

from app.db import get_db
from app.repository.bank import BankRepository
from app.services.bank import BankService


class BankDependencies:
	@staticmethod
	def __get_repository__(db: Session = Depends(get_db)):
		return BankRepository(db)

	@staticmethod
	def get_service(repository: BankRepository = Depends(__get_repository__)):
		return BankService(repository)
