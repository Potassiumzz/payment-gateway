from app.globals.enums import PaymentIntentStatus
from app.models.payment_intent import PaymentIntent
from app.repository.payment_intent import PaymentIntentRepository
from app.schemas.payment_intent import PaymentIntentCreate


class PaymentIntentService:
	def __init__(self, repository: PaymentIntentRepository) -> None:
		self.repository = repository

	def create(self, value: PaymentIntentCreate) -> PaymentIntent:
		intent = PaymentIntent(
			amount=value.amount,
			status=PaymentIntentStatus.REQUIRES_PAYMENT,
		)
		self.repository.create(intent)
		return intent

	def get_intent_details(self, id: str) -> PaymentIntent:
		return self.repository.get_intent_details(id)
