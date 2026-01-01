from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.globals.enums import ClassRelation, TableName


class Transaction(Base):
	__tablename__ = TableName.TRANSACTIONS.value

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

	payment_intent_id: Mapped[str] = mapped_column(
		String,
		ForeignKey(f"{TableName.PAYMENT_INTENTS.value}.id"),
		nullable=False,
		unique=True,
	)

	sender_account_number: Mapped[int] = mapped_column(
		Integer,
		ForeignKey(f"{TableName.BANK_ACCOUNTS.value}.account_number"),
		nullable=False,
	)

	receiver_account_number: Mapped[int] = mapped_column(
		Integer,
		ForeignKey(f"{TableName.BANK_ACCOUNTS.value}.account_number"),
		nullable=False,
	)

	amount_transferred: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

	status: Mapped[str] = mapped_column(String, nullable=False)

	failure_reason: Mapped[str | None] = mapped_column(String, nullable=True)

	timestamp: Mapped[datetime] = mapped_column(
		DateTime, default=lambda: datetime.now(UTC), nullable=False
	)

	payment_intent = relationship(
		f"{ClassRelation.PAYMENT_INTENT.value}", foreign_keys=[payment_intent_id]
	)

	sender_account = relationship(
		f"{ClassRelation.BANK_ACCOUNT.value}", foreign_keys=[sender_account_number]
	)

	receiver_account = relationship(
		f"{ClassRelation.BANK_ACCOUNT.value}", foreign_keys=[receiver_account_number]
	)
