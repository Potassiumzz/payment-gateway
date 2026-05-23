from fastapi import Depends
from sqlalchemy.orm.session import Session

from app.db import get_db
from app.repository.payment_intent import PaymentIntentRepository
from app.services.payment_intent import PaymentIntentService


class PaymentIntentDependencies:
	@staticmethod
	def __get_repository__(db: Session = Depends(get_db)):
		return PaymentIntentRepository(db)

	@staticmethod
	def get_service(repository: PaymentIntentRepository = Depends(__get_repository__)):
		return PaymentIntentService(repository)
