from typing import Any

from app.globals.enums import TransactionStatus
from app.schemas.base import CamelModel


class IdempotencyRequest(CamelModel):
	key: str
	endpoint: str
	response_body: dict[str, Any]
	status: TransactionStatus
	failure_reason: str | None
