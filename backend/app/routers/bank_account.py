from fastapi import Depends
from fastapi.routing import APIRouter

from app.dependencies.bank_account import BankAccountDependencies
from app.globals.enums import RouterPrefix, RouterTag
from app.models import BankAccount
from app.schemas.bank_account import AccountCreate, AccountRespones, AccountUpdate
from app.services.bank_account import BankAccountService

router = APIRouter(prefix=RouterPrefix.ACCOUNTS.value, tags=[RouterTag.ACCOUNTS.value])


@router.post(
	"/", response_model=AccountRespones, description="Create a new bank account."
)
def create_account(
	value: AccountCreate,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
) -> BankAccount:
	return service.create(value)


@router.put("/{id}")
def update_account(
	id: int,
	account: AccountUpdate,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
) -> BankAccount:
	return service.update(id, account)


@router.delete(
	"/{id}",
	status_code=204,
	description="Soft delete the account by making the account's status inactive, rather than deleting the account from database.",
)
def delete_account(
	id: int,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
) -> None:
	return service.delete(id)


@router.delete(
	"/{id}/hard",
	status_code=204,
	description="Delete the account permanently from the database. Only use this while testing during development.",
)
def hard_delete(
	id: int,
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
) -> None:
	return service.hard_delete(id)


@router.get("/")
def get_accounts_list(
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
) -> list[BankAccount]:
	return service.get_all()


@router.get("/{id}")
def get_account(
	id: int, service: BankAccountService = Depends(BankAccountDependencies.get_service)
) -> BankAccount:
	return service.get_by_id(id)
