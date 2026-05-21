from typing import List

from sqlalchemy.orm import Session

from app.models.bank import Bank
from app.schemas.bank import BankCreate
from app.utils.utils import raise_404_error


class BankRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def create(self, value: BankCreate) -> Bank:
		bank = Bank(name=value.name)
		self.db.add(bank)
		self.db.commit()
		self.db.refresh(bank)
		return bank

	def update(self, bank: Bank) -> Bank:
		self.db.commit()
		self.db.refresh(bank)
		return bank

	def delete(self, id: int) -> None:
		self.db.delete(id)
		self.db.commit()
		return

	def get_all(self) -> List[Bank]:
		return self.db.query(Bank).all()

	def get_by_id(self, bank_id: int) -> Bank:
		return self.db.query(Bank).get(bank_id) or raise_404_error()

	def exists_by_name(self, name: str) -> bool:
		return self.db.query(Bank).filter(Bank.name == name).first() is not None
