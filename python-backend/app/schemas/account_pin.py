from pydantic import BaseModel, ConfigDict


class ValidatePinValues(BaseModel):
	pin: str
	account_number: int


class AccountPinValidationResponse(BaseModel):
	response_code: int
	response_msg: str

	class Config:
		model_config = ConfigDict(from_attributes=True)
