import asyncio
import json
from datetime import UTC, datetime

from fastapi import Depends, Query
from fastapi.routing import APIRouter
from starlette.responses import StreamingResponse

from app.dependencies.bank_account import BankAccountDependencies
from app.globals.enums import RouterPrefix, RouterTag
from app.schemas.bank_account import (
	AccountCreate,
	AccountListResponse,
	AccountResponse,
	AccountUpdate,
)
from app.services.bank_account import BankAccountService
from app.utils.sse_bus import subscribe, unsubscribe

router = APIRouter(prefix=RouterPrefix.ACCOUNTS.value, tags=[RouterTag.ACCOUNTS.value])


@router.get("/sse")
async def account_events(
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	async def stream():
		q = subscribe()
		try:
			while True:
				next_expiry = service.get_next_expiry()
				if next_expiry:
					now = datetime.now(UTC).replace(tzinfo=None)
					delay = (next_expiry - now).total_seconds()
					if delay > 0:
						await asyncio.sleep(delay)
					service.sync_all_expired()
					# sync_all_expired calls __sync_expiry which publishes to queue
					event = await q.get()
					yield f"data: {json.dumps(event)}\n\n"
				else:
					# no expiring accounts, just keepalive every 30s
					await asyncio.sleep(30)
					yield ": keepalive\n\n"
		finally:
			unsubscribe(q)

	return StreamingResponse(
		stream(),
		media_type="text/event-stream",
		headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
	)


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
	response_model=AccountListResponse,
	description="Get the list of all bank accounts.",
)
def get_accounts_list(
	page: int = Query(1, ge=1),
	limit: int = Query(10, ge=1, le=100),
	search: str | None = Query(None),
	service: BankAccountService = Depends(BankAccountDependencies.get_service),
):
	offset = (page - 1) * limit
	items, total = service.get_all(search=search, offset=offset, limit=limit)
	return {"items": items, "total": total, "page": page, "limit": limit}


@router.get(
	"/{id}",
	response_model=AccountResponse,
	description="Get the bank account by its ID.",
)
def get_account(
	id: int, service: BankAccountService = Depends(BankAccountDependencies.get_service)
):
	return service.get_by_id(id)
