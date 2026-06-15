from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import BankAccount
from app.utils.http_errors import raise_404_error


class BankAccountRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def commit(self) -> None:
		self.db.commit()

	def rollback(self) -> None:
		self.db.rollback()

	def get_max_ac_number(self, bank_id: int) -> int | None:
		return (
			self.db.query(func.max(BankAccount.account_number))
			.filter(BankAccount.bank_id == bank_id)
			.scalar()
		)

	def create(self, account: BankAccount) -> BankAccount:
		self.db.add(account)
		# self.db.commit()
		self.db.flush()
		self.db.refresh(account)
		return account

	def update(self, account: BankAccount) -> BankAccount:
		self.db.commit()
		self.db.refresh(account)
		return account

	def delete(self) -> None:
		self.db.commit()
		return

	def hard_delete(self, id: int) -> None:
		self.db.delete(id)
		self.db.commit()
		return

	def get_all(self) -> list[BankAccount]:
		return self.db.query(BankAccount).all()

	def get_by_id(self, id: int) -> BankAccount:
		account = self.db.query(BankAccount).get(id)
		if account is None:
			raise_404_error(f"Account with ID: {id} not found.")
		return account

	def get_by_ac_number(self, ac_number: int) -> BankAccount:
		account = (
			self.db.query(BankAccount)
			.filter(BankAccount.account_number == ac_number)
			.first()
		)
		if account is None:
			raise_404_error(f"Account with account number: {ac_number} not found.")
		return account
