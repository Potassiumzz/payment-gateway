from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class AccountCreate(BaseModel):
	owner_name: str
	bank_id: int


class AccountUpdate(BaseModel):
	owner_name: Optional[str] = None


class AccountRespones(BaseModel):
	account_number: int
	owner_name: str
	bank_id: int
	bank_name: str
	balance: Decimal = Field(..., examples=["500.00"])
	is_active: bool

	class Config:
		orm_mode = True
