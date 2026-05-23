from sqlalchemy.orm import Session

from app.models.payment_intent import PaymentIntent
from app.utils.utils import raise_404_error


class PaymentIntentRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def create(self, intent: PaymentIntent) -> PaymentIntent:
		self.db.add(intent)
		self.db.commit()
		self.db.refresh(intent)
		return intent

	def get_intent_details(self, id: str) -> PaymentIntent:
		return (
			self.db.query(PaymentIntent).filter(PaymentIntent.id == id).first()
			or raise_404_error()
		)
