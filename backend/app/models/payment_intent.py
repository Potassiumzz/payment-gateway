from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.globals.enums import PaymentIntentStatus, TableName
from app.utils.utils import generate_intent_id


class PaymentIntent(Base):
	__tablename__ = TableName.PAYMENT_INTENTS.value

	id: Mapped[str] = mapped_column(
		String, primary_key=True, default=generate_intent_id
	)
	amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
	status: Mapped[PaymentIntentStatus] = mapped_column(
		Enum(PaymentIntentStatus, name="payment_status"),
		nullable=False,
		default=PaymentIntentStatus.REQUIRES_PAYMENT,
	)
	attempt_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
	created_at: Mapped[datetime] = mapped_column(
		DateTime, default=lambda: datetime.now(UTC), nullable=False
	)
