from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.globals.enums import ClassRelation, TableName


class Transaction(Base):
	__tablename__ = TableName.TRANSACTIONS.value

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	sender_account_id: Mapped[int] = mapped_column(
		Integer,
		ForeignKey(f"{TableName.BANK_ACCOUNTS.value}.id"),
		nullable=False,
	)
	receiver_account_id: Mapped[int] = mapped_column(
		Integer,
		ForeignKey(f"{TableName.BANK_ACCOUNTS.value}.id"),
		nullable=False,
	)
	amount_transferred: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
	timestamp: Mapped[datetime] = mapped_column(
		DateTime, default=lambda: datetime.now(UTC), nullable=False
	)
	sender_account = relationship(
		f"{ClassRelation.BANK_ACCOUNT.value}", foreign_keys=[sender_account_id]
	)
	receiver_account = relationship(
		f"{ClassRelation.BANK_ACCOUNT.value}", foreign_keys=[receiver_account_id]
	)
