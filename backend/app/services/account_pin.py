from datetime import UTC, datetime

from app.models import AccountPin
from app.models.bank_account import BankAccount
from app.repository.account_pin import AccountPinRepository
from app.schemas.bank_account import AccountCreate
from app.utils.http_errors import raise_401_error, raise_403_error, raise_404_error
from app.utils.security_pin import LOCK_TIME, MAX_ATTEMPTS, hash_pin, verify_pin


class AccountPinService:
	def __init__(self, repository: AccountPinRepository) -> None:
		self.repository = repository

	def create(self, value: BankAccount, account: AccountCreate) -> AccountPin:
		pin = AccountPin(
			bank_account_id=value.id,
			pin_hash=hash_pin(account.pin),
			failed_attempts=0,
			locked_until=None,
		)
		return self.repository.create(pin)

	def update(self, pin: str) -> AccountPin:
		pin = AccountPin(pin_hash=hash_pin(pin), failed_attempts=0, locked_until=None)
		return self.repository.update(pin)

	def validate_account_pin(
		self,
		account: BankAccount,
		pin: str,
	) -> AccountPin:
		pin_record = self.repository.get_pin_record(account)

		if not pin_record:
			raise_404_error()

		now = datetime.now(UTC)

		if pin_record.locked_until and pin_record.locked_until > now:
			raise_403_error("Account temporarily locked due to failed PIN attempts.")

		if not verify_pin(pin, pin_record.pin_hash):
			if pin_record.failed_attempts >= MAX_ATTEMPTS:
				pin_record.locked_until = now + LOCK_TIME

			pin_record.failed_attempts += 1

			self.repository.update(pin_record)
			raise_401_error()

		# on success
		pin_record.failed_attempts = 0
		pin_record.locked_until = None
		return self.repository.update(pin_record)
