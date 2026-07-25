from sqlalchemy.orm import Session

from app.models import IdempotencyKey


class IdempotencyRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def save(self, value: IdempotencyKey) -> IdempotencyKey:
		self.db.add(value)
		self.db.commit()
		self.db.refresh(value)

		return value

	def get_existing_response(
		self,
		key: str,
		endpoint: str,
	) -> IdempotencyKey | None:
		return (
			self.db.query(IdempotencyKey)
			.filter(
				IdempotencyKey.key == key,
				IdempotencyKey.endpoint == endpoint,
			)
			.first()
		)

	def update(self, value: IdempotencyKey) -> IdempotencyKey:
		self.db.commit()
		self.db.refresh(value)
		return value
