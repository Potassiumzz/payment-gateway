from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.globals.enums import TableName


class Bank(Base):
	__tablename__ = TableName.BANKS.value

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	name: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)

	accounts = relationship("BankAccount", back_populates="bank")


class BankAccount(Base):
	__tablename__ = TableName.BANK_ACCOUNTS.value

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	account_number: Mapped[int] = mapped_column(
		Integer, unique=True, index=True, nullable=False
	)
	balance: Mapped[Decimal] = mapped_column(
		Numeric(10, 2), nullable=False
	)  # max value = 99999999.99
	owner_name: Mapped[str] = mapped_column(String, nullable=False)

	bank_id: Mapped[int] = mapped_column(
		Integer, ForeignKey("banks.id"), nullable=False
	)

	bank = relationship("Bank", back_populates="accounts")
