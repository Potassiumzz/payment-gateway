from fastapi import Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.repository.idempotency import IdempotencyRepository
from app.services.idempotency import IdempotencyService


class IdempotencyDependencies:
	@staticmethod
	def __get_repository__(db: Session = Depends(get_db)):
		return IdempotencyRepository(db)

	@staticmethod
	def get_service(repository: IdempotencyRepository = Depends(__get_repository__)):
		return IdempotencyService(repository)
