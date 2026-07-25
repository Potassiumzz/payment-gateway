import os
from typing import NamedTuple

from sqlalchemy.orm import Session

from app.models.account_pin import AccountPin
from app.models.bank import Bank
from app.models.bank_account import BankAccount
from app.utils.security_pin import hash_pin

DEFAULT_PIN = os.getenv("DEFAULT_ACCOUNT_PIN", "4321")

DEFAULT_BANKS = [
	{"name": "Maze Bank"},
	{"name": "Lombank"},
]


class DefaultAccount(NamedTuple):
	account_number: str
	balance: int
	owner_name: str
	bank_index: int


DEFAULT_ACCOUNTS = [
	DefaultAccount("100001", 500, "Michael De Santa", 0),
	DefaultAccount("100002", 500, "Trevor Philips", 0),
	DefaultAccount("200001", 500, "Franklin Clinton", 1),
]


def seed_defaults(db: Session) -> None:
	if db.query(Bank).count() > 0:
		return  # already seeded, no-op

	banks = [Bank(**b) for b in DEFAULT_BANKS]
	db.add_all(banks)
	db.flush()  # populate bank.id without committing

	for acc in DEFAULT_ACCOUNTS:
		account = BankAccount(
			account_number=acc.account_number,
			balance=acc.balance,
			owner_name=acc.owner_name,
			bank_id=banks[acc.bank_index].id,
			is_active=True,
			is_default=True,
			expires_at=None,
		)
		db.add(account)
		db.flush()  # get account.id

		db.add(
			AccountPin(
				bank_account_id=account.id,
				pin_hash=hash_pin(DEFAULT_PIN),
			)
		)

	db.commit()
