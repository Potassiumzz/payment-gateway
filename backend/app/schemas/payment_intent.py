from decimal import Decimal

from pydantic import BaseModel, Field

from app.globals.enums import PaymentIntentStatus


class PaymentIntentCreate(BaseModel):
	amount: Decimal = Field(..., gt=0, examples=["20.00"])


class PaymentIntentResponse(BaseModel):
	id: str
	amount: Decimal
	status: PaymentIntentStatus
