from app.globals.constants import MAX_AMOUNT
from app.globals.enums import PaymentIntentStatus
from app.models.payment_intent import PaymentIntent
from app.repository.payment_intent import PaymentIntentRepository
from app.schemas import PaymentIntentResponse
from app.schemas.payment_intent import PaymentIntentCreate


class PaymentIntentService:
	def __init__(self, repository: PaymentIntentRepository, frontend_url: str) -> None:
		self.repository = repository
		self.frontend_url = frontend_url

	def create(self, value: PaymentIntentCreate) -> PaymentIntentResponse:
		if value.amount > MAX_AMOUNT:
			raise ValueError("Amount exceeds maximum allowed value.")

		intent = PaymentIntent(
			amount=value.amount,
			status=PaymentIntentStatus.REQUIRES_PAYMENT,
			return_url=value.return_url,
			receiver_account_number=value.receiver_account_number,
		)
		self.repository.create(intent)
		return PaymentIntentResponse(
			**intent.__dict__,
			checkout_url=f"{self.frontend_url}/checkout/{intent.id}",
		)

	def get_intent_details(self, id: str) -> PaymentIntentResponse:
		"""For API responses; Read-only DTO."""
		intent = self.repository.get_intent_details(id)
		return PaymentIntentResponse(
			**intent.__dict__,
			checkout_url=f"{self.frontend_url}/checkout/{intent.id}",
		)

	def get_intent(self, id: str) -> PaymentIntent:
		"""For internal service use; the live, mutable ORM entity."""
		return self.repository.get_intent_details(id)
