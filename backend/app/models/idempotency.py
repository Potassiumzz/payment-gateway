from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Integer, String
from sqlalchemy.orm import mapped_column

from app.db import Base


class IdempotencyKey(Base):
	__tablename__ = "idempotency_keys"

	key = mapped_column(String, primary_key=True)
	endpoint = mapped_column(String, nullable=False)
	response_body = mapped_column(JSON, nullable=False)
	status_code = mapped_column(Integer, nullable=False)
	created_at = mapped_column(
		DateTime, default=lambda: datetime.now(UTC), nullable=False
	)
