from typing import List

from fastapi import Depends
from fastapi.routing import APIRouter

from app.dependencies.bank import BankDependencies
from app.globals.enums import RouterPrefix, RouterTag
from app.models import Bank
from app.schemas.bank import BankCreate, BankResponse
from app.services.bank import BankService

router = APIRouter(prefix=RouterPrefix.BANKS.value, tags=[RouterTag.BANKS.value])


@router.post("/", response_model=BankResponse, description="Create a new bank.")
def create_bank(
	value: BankCreate, service: BankService = Depends(BankDependencies.get_service)
) -> Bank:
	return service.create(value)


@router.put(
	"/{id}", response_model=BankResponse, description="Update a bank by its ID."
)
def update_bank(
	id: int,
	value: BankCreate,
	service: BankService = Depends(BankDependencies.get_service),
):
	return service.update(id, value)


@router.delete(
	"/{id}", status_code=204, description="Delete an existing bank by its ID"
)
def delete_bank(id: int, service: BankService = Depends(BankDependencies.get_service)):
	service.delete(id)


@router.get(
	"/",
	response_model=list[BankResponse],
	description="Get a list of all banks.",
)
def get_banks_list(
	service: BankService = Depends(BankDependencies.get_service),
) -> List[Bank]:
	return service.get_all()


@router.get(
	"/{id}",
	response_model=BankResponse,
	description="Get a bank by its ID.",
)
def get_bank(id: int, service: BankService = Depends(BankDependencies.get_service)):
	return service.get_by_id(id)
