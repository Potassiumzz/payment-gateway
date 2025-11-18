from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.globals.enums import ClassRelation, TableName


class Bank(Base):
	__tablename__ = TableName.BANKS.value

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	name: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)

	accounts = relationship(
		f"{ClassRelation.BANK_ACCOUNT.value}", back_populates="bank"
	)
