from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.globals.enums import TableName


class AccountPin(Base):
	__tablename__ = TableName.ACCOUNT_PINS.value

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	bank_account_id: Mapped[int] = mapped_column(
		ForeignKey(f"{TableName.BANK_ACCOUNTS.value}.id"), unique=True, nullable=False
	)
	pin_hash: Mapped[str] = mapped_column(String, nullable=False)
	failed_attempts: Mapped[int] = mapped_column(Integer, default=0)
	locked_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
	created_at: Mapped[datetime] = mapped_column(
		DateTime, default=lambda: datetime.now(UTC), nullable=False
	)

	bank_account = relationship(
		"BankAccount",
		back_populates="account_pin",
		foreign_keys=[bank_account_id],
	)
