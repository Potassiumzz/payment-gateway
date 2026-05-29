import logging
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

	def create(self, value: AccountCreate) -> BankAccount:
		bank = self.bank_service.get_by_id(value.bank_id)

		if not bank:
			raise_400_error("Bank does not exist.")

		ac_num = self.__generate_ac_number(value.bank_id)

		account = BankAccount(
			account_number=ac_num,
			owner_name=value.owner_name,
			bank_id=bank.id,
			balance=Decimal("500.00"),
			is_active=True,
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

	def get_all(self) -> list[BankAccount]:
		return self.repository.get_all()

	def get_by_id(self, id: int) -> BankAccount:
		return self.repository.get_by_id(id)
