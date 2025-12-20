from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.globals.enums import TransactionStatus
from app.schemas import TransactionResponse


class IdempotencyKey(Base):
	__tablename__ = "idempotency_keys"

	key: Mapped[str] = mapped_column(String, primary_key=True)
	endpoint: Mapped[str] = mapped_column(String, nullable=False)
	response_body: Mapped[TransactionResponse] = mapped_column(JSON, nullable=False)
	status: Mapped[TransactionStatus] = mapped_column(
		Enum(TransactionStatus, name="transaction_status"), nullable=False
	)
	failure_reason: Mapped[str | None] = mapped_column(String, nullable=True)
	created_at: Mapped[datetime] = mapped_column(
		DateTime, default=lambda: datetime.now(UTC), nullable=False
	)
