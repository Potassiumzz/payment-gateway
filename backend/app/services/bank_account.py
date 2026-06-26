import logging
from datetime import UTC, datetime, timedelta
from decimal import Decimal

from app.models import BankAccount
from app.repository.bank_account import BankAccountRepository
from app.schemas.bank_account import AccountCreate, AccountUpdate
from app.services.account_pin import AccountPinService
from app.services.bank import BankService
from app.utils.http_errors import raise_400_error, raise_404_error, raise_500_error

logger = logging.getLogger(__name__)


class BankAccountService:
	def __init__(
		self,
		repository: BankAccountRepository,
		bank_service: BankService,
		pin_service: AccountPinService,
	) -> None:
		self.repository = repository
		self.bank_service = bank_service
		self.pin_service = pin_service

	def __generate_ac_number(self, bank_id: int) -> int:
		max_num = self.repository.get_max_ac_number(bank_id)
		if not max_num:
			return int(f"{bank_id}00001")

		return max_num + 1

	def __sync_expiry(self, account: BankAccount) -> BankAccount:
		now = datetime.now(UTC).replace(tzinfo=None)
		if account.expires_at and now >= account.expires_at and account.is_active:
			account.is_active = False
			try:
				self.repository.commit()
			except Exception:
				self.repository.rollback()
		return account

	def create(self, value: AccountCreate) -> BankAccount:
		bank = self.bank_service.get_by_id(value.bank_id)

		if not bank:
			raise_400_error("Bank does not exist.")

		ac_num = self.__generate_ac_number(value.bank_id)

		now = datetime.now(UTC).replace(tzinfo=None)

		account = BankAccount(
			account_number=ac_num,
			owner_name=value.owner_name,
			bank_id=bank.id,
			balance=Decimal("500.00"),
			is_active=True,
			is_default=False,
			expires_at=now + timedelta(days=2),
		)

		try:
			self.repository.create(account)
			self.pin_service.create(account, value)
			self.repository.commit()
		except Exception:
			self.repository.rollback()
			logger.exception("Failed to create bank account.")
			raise_500_error("Failed to create bank account.")
		return account

	def update(self, id: int, value: AccountUpdate) -> BankAccount:
		account = self.repository.get_by_id(id)

		if not account:
			raise_404_error()

		if value.owner_name:
			account.owner_name = value.owner_name

		return self.repository.update(account)

	def delete(self, id: int) -> None:
		account = self.get_by_id(id)
		account.is_active = False
		return self.repository.delete()

	def hard_delete(self, id: int) -> None:
		return self.repository.hard_delete(id)

	def get_all(
		self, search: str | None, offset: int, limit: int
	) -> tuple[list[BankAccount], int]:
		return self.repository.get_all(search=search, offset=offset, limit=limit)

	def get_by_id(self, id: int) -> BankAccount:
		return self.__sync_expiry(self.repository.get_by_id(id))

	def get_by_ac_number(self, ac_number: int) -> BankAccount:
		return self.__sync_expiry(self.repository.get_by_ac_number(ac_number))

	def get_next_expiry(self) -> datetime | None:
		return self.repository.get_next_expiry()

	def sync_all_expired(self) -> None:
		accounts = self.repository.get_all_expired()
		for account in accounts:
			self.__sync_expiry(account)
