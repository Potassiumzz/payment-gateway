from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.db import Base


class Bank(Base):
	__tablename__ = "banks"

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, unique=True, index=True, nullable=False)

	accounts = relationship("BankAccount", back_populates="bank")


class BankAccount(Base):
	__tablename__ = "bank_accounts"

	id = Column(Integer, primary_key=True, index=True)
	account_number = Column(Integer, unique=True, index=True, nullable=False)
	balance = Column(Numeric(10, 2), nullable=False)  # max value = 99999999.99
	owner_name = Column(String, nullable=False)

	bank_id = Column(Integer, ForeignKey("banks.id"), nullable=False)

	bank = relationship("Bank", back_populates="accounts")
