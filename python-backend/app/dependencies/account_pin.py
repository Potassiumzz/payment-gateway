from fastapi import Depends
from sqlalchemy.orm.session import Session

from app.db import get_db
from app.repository.account_pin import AccountPinRepository
from app.services.account_pin import AccountPinService


class AccountPinDependencies:
	@staticmethod
	def __get_repository__(db: Session = Depends(get_db)):
		return AccountPinRepository(db)

	@staticmethod
	def get_service(
		repository: AccountPinRepository = Depends(__get_repository__),
	):
		return AccountPinService(repository)
