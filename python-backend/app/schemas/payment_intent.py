from decimal import Decimal

from pydantic import Field

from app.globals.constants import MAX_AMOUNT
from app.globals.enums import PaymentIntentStatus
from app.schemas.base import CamelModel, CamelResponseModel


class PaymentIntentCreate(CamelModel):
	amount: Decimal = Field(..., gt=0, le=MAX_AMOUNT, examples=["20.00"])
	return_url: str | None = None
	receiver_account_number: int | None = None


class PaymentIntentResponse(CamelResponseModel):
	id: str
	amount: Decimal = Field(..., examples=["20.00"])
	status: PaymentIntentStatus
	return_url: str | None = None
	receiver_account_number: int | None = None
	checkout_url: str
	# attempt_count: int
