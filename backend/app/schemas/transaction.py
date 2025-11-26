from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
	sender_account_number: int
	receiver_account_number: int
	amount: Decimal = Field(..., gt=0, examples=["120.00"])


class TransactionResponse(BaseModel):
	id: int
	sender_account_number: int
	sender_owner_name: str
	sender_bank_name: str

	receiver_account_number: int
	receiver_owner_name: str
	receiver_bank_name: str

	amount_transferred: Decimal = Field(..., examples=["50.00"])
	timestamp: datetime

	class Config:
		orm_mode = True
