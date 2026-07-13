from datetime import UTC, datetime

from sqlalchemy import String, cast, func, or_
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

	def get_all(
		self, search: str | None, offset: int, limit: int
	) -> tuple[list[BankAccount], int]:
		query = self.db.query(BankAccount).filter(
			BankAccount.is_active.is_(True),
			or_(
				BankAccount.expires_at.is_(None),
				BankAccount.expires_at > datetime.now(UTC),
			),
		)
		if search:
			query = query.filter(
				or_(
					BankAccount.owner_name.ilike(f"%{search}%"),
					cast(BankAccount.account_number, String).ilike(f"%{search}%"),
				)
			)
		total = query.count()
		items = query.order_by(BankAccount.id.desc()).offset(offset).limit(limit).all()
		return items, total

	def get_by_id(self, id: int) -> BankAccount:
		account = (
			self.db.query(BankAccount)
			.filter(
				BankAccount.id == id,
				BankAccount.is_active.is_(True),
				or_(
					BankAccount.expires_at.is_(None),
					BankAccount.expires_at > datetime.now(UTC),
				),
			)
			.first()
		)

		if account is None:
			raise_404_error(f"Account with ID: {id} not found.")

		return account

	def get_by_ac_number(self, ac_number: int) -> BankAccount:
		account = (
			self.db.query(BankAccount)
			.filter(
				BankAccount.account_number == ac_number,
				BankAccount.is_active.is_(True),
				or_(
					BankAccount.expires_at.is_(None),
					BankAccount.expires_at > datetime.now(UTC),
				),
			)
			.first()
		)
		if account is None:
			raise_404_error(f"Account number {ac_number} not found.")
		return account

	def get_next_expiry(self) -> datetime | None:
		return (
			self.db.query(func.min(BankAccount.expires_at))
			.filter(
				BankAccount.is_active,
				BankAccount.expires_at.isnot(None),
			)
			.scalar()
		)

	def get_all_expired(self) -> list[BankAccount]:
		now = datetime.now(UTC)
		return (
			self.db.query(BankAccount)
			.filter(
				BankAccount.is_active,
				BankAccount.expires_at <= now,
			)
			.all()
		)

	def refill_balance(self, account: BankAccount) -> BankAccount:
		self.db.commit()
		self.db.refresh(account)
		return account
