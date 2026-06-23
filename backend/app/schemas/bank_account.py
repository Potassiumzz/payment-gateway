from datetime import datetime
from decimal import Decimal
from typing import Annotated, Optional

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from app.schemas import BankResponse

Pin = Annotated[
	str,
	StringConstraints(
		pattern=r"^\d{4}$",
		min_length=4,
		max_length=4,
	),
]


class AccountCreate(BaseModel):
	owner_name: str
	bank_id: int
	pin: Pin = Field(
		...,
		examples=["1234"],
		description="Exactly 4 numeric digits.",
	)


class AccountUpdate(BaseModel):
	owner_name: Optional[str] = None


class AccountResponse(BaseModel):
	model_config = ConfigDict(json_encoders={Decimal: float})
	id: int
	account_number: int
	owner_name: str
	balance: Decimal = Field(..., examples=["500.00"])
	is_active: bool
	is_default: bool
	expires_at: datetime | None
	bank: BankResponse


class AccountListResponse(BaseModel):
	items: list[AccountResponse]
	total: int
	page: int
	limit: int

	class Config:
		model_config = ConfigDict(from_attributes=True)
