from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.schemas.base import CamelModel, CamelResponseModel


class TransactionCreate(CamelModel):
	payment_intent_id: str
	sender_account_number: int
	receiver_account_number: int
	security_pin: str


class TransactionResponse(CamelResponseModel):
	id: int
	payment_intent_id: str
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
	return_url: str | None
