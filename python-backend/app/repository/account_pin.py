from sqlalchemy.orm.session import Session

from app.models.account_pin import AccountPin
from app.models.bank_account import BankAccount


class AccountPinRepository:
	def __init__(self, db: Session) -> None:
		self.db = db

	def create(self, value: AccountPin) -> AccountPin:
		self.db.add(value)
		self.db.commit()
		self.db.refresh(value)
		return value

	def update(self, value: AccountPin) -> AccountPin:
		self.db.commit()
		self.db.refresh(value)
		return value

	def get_pin_record(self, value: BankAccount) -> AccountPin:
		return (
			self.db.query(AccountPin)
			.filter(AccountPin.bank_account_id == value.id)
			.first()
		)
