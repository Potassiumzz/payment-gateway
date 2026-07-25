from typing import Any

from pydantic import BaseModel, ConfigDict

from app.globals.enums import TransactionStatus


class IdempotencyRequest(BaseModel):
	model_config = ConfigDict(from_attributes=True)

	key: str
	endpoint: str
	response_body: dict[str, Any]
	status: TransactionStatus
	failure_reason: str | None
