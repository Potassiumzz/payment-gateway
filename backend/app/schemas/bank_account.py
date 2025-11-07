from typing import Optional

from pydantic import BaseModel, model_validator


class AccountCreate(BaseModel):
	owner_name: str
	bank_id: Optional[int] = None
	bank_name: Optional[str] = None
	is_active: Optional[bool] = True

	@model_validator(mode="after")
	def validate_account_create_field(self):
		if not self.bank_name and not self.bank_id:
			raise ValueError("Either bank_id or bank_name is required")
		return self


class AccountUpdate(BaseModel):
	owner_name: Optional[str] = None

	class Config:
		orm_mode = True
