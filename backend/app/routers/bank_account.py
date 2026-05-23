from fastapi import Depends
from fastapi.routing import APIRouter

from app.dependencies.bank_account import BankAccountDependencies
from app.globals.enums import RouterPrefix, RouterTag
from app.schemas.bank_account import AccountCreate, AccountResponse, AccountUpdate
from app.services.bank_account import BankAccountService

router = APIRouter(prefix=RouterPrefix.ACCOUNTS.value, tags=[RouterTag.ACCOUNTS.value])


@router.post(
	"/", response_model=AccountResponse, description="Create a new bank account."
)
def create_account(
	value: AccountCreate,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	return service.create(value)


@router.put(
	"/{id}",
	response_model=AccountResponse,
	description="Update the bank account by its ID. Only the account's name and PIN can be updated.",
)
def update_account(
	id: int,
	account: AccountUpdate,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	return service.update(id, account)


@router.delete(
	"/{id}",
	status_code=204,
	response_model=None,
	description="Soft delete the account by making the account's status inactive, rather than deleting the account from database.",
)
def delete_account(
	id: int,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	return service.delete(id)


@router.delete(
	"/{id}/hard",
	status_code=204,
	description="Delete the account permanently from the database. Only use this while testing during development.",
)
def hard_delete(
	id: int,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	return service.hard_delete(id)


@router.get(
	"/",
	response_model=list[AccountResponse],
	description="Get the list of all bank accounts.",
)
def get_accounts_list(
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	return service.get_all()


@router.get(
	"/{id}",
	response_model=AccountResponse,
	description="Get the bank account by its ID.",
)
def get_account(
	id: int, service: BankAccountService = Depends(BankAccountDependencies.get_service)
):
	return service.get_by_id(id)
