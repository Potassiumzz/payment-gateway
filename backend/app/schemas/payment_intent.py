from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.globals.constants import MAX_AMOUNT
from app.globals.enums import PaymentIntentStatus


class PaymentIntentCreate(BaseModel):
	amount: Decimal = Field(..., gt=0, le=MAX_AMOUNT, examples=["20.00"])
	return_url: str | None = None


class PaymentIntentResponse(BaseModel):
	id: str
	amount: Decimal = Field(..., examples=["20.00"])
	status: PaymentIntentStatus
	return_url: str | None = None

	class Config:
		model_config = ConfigDict(from_attributes=True)
