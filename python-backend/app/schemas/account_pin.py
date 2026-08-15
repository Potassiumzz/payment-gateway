from app.schemas.base import CamelModel, CamelResponseModel


class ValidatePinValues(CamelModel):
	pin: str
	account_number: int


class AccountPinValidationResponse(CamelResponseModel):
	response_code: int
	response_msg: str
