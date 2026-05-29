from fastapi import Depends
from fastapi.routing import APIRouter

from app.dependencies.account_pin import AccountPinDependencies
from app.dependencies.bank_account import BankAccountDependencies
from app.globals.enums import RouterPrefix, RouterTag
from app.schemas.account_pin import AccountPinValidationResponse, ValidatePinValues
from app.services.account_pin import AccountPinService
from app.services.bank_account import BankAccountService

router = APIRouter(
	prefix=RouterPrefix.ACCOUNT_PIN.value, tags=[RouterTag.ACCOUNT_PIN.value]
)


@router.post(
	"/",
	response_model=AccountPinValidationResponse,
	description="Only a testing route for now to validate the pin of the bank account during payment. This is only supposed to be a simulation of a real system, and this route is supposed to be an API to the real bank system which then verifies the pin. Since we do not have a real bank's API, we will just simulate it.",
)
def validate_pin_endpoint(
	value: ValidatePinValues,
	pin_service: AccountPinService = Depends(AccountPinDependencies.get_service),
	account_service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	account = account_service.get_by_id(value.account_number)
	pin_service.validate_account_pin(account, value.pin)
	return {"response_code": 0, "response_msg": "PIN valid"}
