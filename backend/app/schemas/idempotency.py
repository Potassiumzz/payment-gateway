from typing import Any

from pydantic import ConfigDict

from app.globals.enums import TransactionStatus


class IdempotencyRequest:
	key: str
	endpoint: str
	response_body: dict[str, Any]
	status: TransactionStatus
	failure_reason: str | None

	class Config:
		model_config = ConfigDict(from_attributes=True)
