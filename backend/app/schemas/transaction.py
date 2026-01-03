from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class TransactionCreate(BaseModel):
	payment_intent_id: str
	sender_account_number: int
	receiver_account_number: int
	security_pin: str


class TransactionResponse(BaseModel):
	id: int
	sender_account_number: int
	sender_owner_name: str
	sender_bank_name: str

	receiver_account_number: int
	receiver_owner_name: str
	receiver_bank_name: str
	status: str
	failure_reason: str | None

	amount_transferred: Decimal = Field(..., examples=["50.00"])
	timestamp: datetime

	class Config:
		model_config = ConfigDict(from_attributes=True)
