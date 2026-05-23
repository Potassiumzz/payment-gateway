from decimal import Decimal

from app.models import BankAccount
from app.repository.bank_account import BankAccountRepository
from app.schemas.bank_account import AccountCreate, AccountUpdate
from app.services.account_pin import AccountPinService
from app.services.bank import BankService
from app.utils.utils import raise_400_error, raise_404_error


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

	def __generate_ac_number(self, value: AccountCreate) -> int:
		existing_nums = self.repository.get_all_ac_numbers()
		initial_num = int(str(value.bank_id)[:1])
		other_nums = existing_nums[-1] + 1
		ac_num = str(initial_num + other_nums)
		return int(ac_num)

	def create(self, value: AccountCreate) -> BankAccount:
		bank = self.bank_service.get_by_id(value.bank_id)

		if not bank:
			raise_400_error()

		ac_num = self.__generate_ac_number(value)

		account = BankAccount(
			account_number=ac_num,
			owner_name=value.owner_name,
			bank_id=bank.id,
			balance=Decimal("500.00"),
			is_active=True,
		)

		self.repository.create(account)
		self.pin_service.create(account, value)
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
