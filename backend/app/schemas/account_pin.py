from pydantic import BaseModel


class ValidatePinValues(BaseModel):
	pin: str
	account_number: int


class AccountPinValidationResponse(BaseModel):
	response_code: int
	response_msg: str

	class Config:
		orm_mode = True
