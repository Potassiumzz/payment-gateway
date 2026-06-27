from app.globals.constants import MAX_AMOUNT
from app.globals.enums import PaymentIntentStatus
from app.models.payment_intent import PaymentIntent
from app.repository.payment_intent import PaymentIntentRepository
from app.schemas.payment_intent import PaymentIntentCreate


class PaymentIntentService:
	def __init__(self, repository: PaymentIntentRepository) -> None:
		self.repository = repository

	def create(self, value: PaymentIntentCreate) -> PaymentIntent:
		if value.amount > MAX_AMOUNT:
			raise ValueError("Amount exceeds maximum allowed value.")

		intent = PaymentIntent(
			amount=value.amount,
			status=PaymentIntentStatus.REQUIRES_PAYMENT,
			return_url=value.return_url,
		)
		self.repository.create(intent)
		return intent

	def get_intent_details(self, id: str) -> PaymentIntent:
		return self.repository.get_intent_details(id)
