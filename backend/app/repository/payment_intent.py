from sqlalchemy.orm import Session

from app.models.payment_intent import PaymentIntent
from app.utils.http_errors import raise_404_error


class PaymentIntentRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def create(self, intent: PaymentIntent) -> PaymentIntent:
		self.db.add(intent)
		self.db.commit()
		self.db.refresh(intent)
		return intent

	def get_intent_details(self, id: str) -> PaymentIntent:
		intent_detail = (
			self.db.query(PaymentIntent).filter(PaymentIntent.id == id).first()
		)
		if not intent_detail:
			raise_404_error()
		return intent_detail
