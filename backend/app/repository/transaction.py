from sqlalchemy.orm import Session

from app.models.transaction import Transaction


class TransactionRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def create(self, transaction: Transaction) -> Transaction:
		self.db.add(transaction)
		self.db.commit()
		self.db.refresh(transaction)
		return transaction

	def delete(self, id: int) -> None:
		self.db.delete(id)
		self.db.commit()
		return

	def get_all(self) -> list[Transaction]:
		return self.db.query(Transaction).all()

	def get_by_id(self, id: int) -> Transaction:
		return self.db.query(Transaction).filter(Transaction.id == id).first()
