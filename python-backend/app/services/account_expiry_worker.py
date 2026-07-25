import asyncio
from datetime import UTC, datetime

from app.db import SessionLocal
from app.repository.account_pin import AccountPinRepository
from app.repository.bank import BankRepository
from app.repository.bank_account import BankAccountRepository
from app.services.account_pin import AccountPinService
from app.services.bank import BankService
from app.services.bank_account import BankAccountService


async def run_account_expiry_worker() -> None:
	while True:
		db = SessionLocal()
		try:
			service = BankAccountService(
				BankAccountRepository(db),
				BankService(BankRepository(db)),
				AccountPinService(AccountPinRepository(db)),
			)
			next_expiry = service.get_next_expiry()
			if next_expiry:
				now = datetime.now(UTC)
				delay = max((next_expiry - now).total_seconds(), 0)
				await asyncio.sleep(delay)
				service.sync_all_expired()
			else:
				await asyncio.sleep(30)
		finally:
			db.close()
