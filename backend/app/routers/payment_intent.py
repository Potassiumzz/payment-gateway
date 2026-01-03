from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.globals.enums import PaymentIntentStatus, RouterPrefix, RouterTag
from app.models.payment_intent import PaymentIntent
from app.schemas import PaymentIntentCreate
from app.schemas.payment_intent import PaymentIntentResponse

router = APIRouter(
	prefix=RouterPrefix.PAYMENT_INTENTS.value, tags=[RouterTag.PAYMENT_INTENTS.value]
)


@router.post(
	"/",
	response_model=PaymentIntentResponse,
	description="Create payment intent. This represents when a payment intent is being created. It should not be created by the user themselves, and the value is supposed to come from the backend of the merchant directly.",
)
def create_payment_intent(value: PaymentIntentCreate, db: Session = Depends(get_db)):
	intent = PaymentIntent(
		amount=value.amount,
		status=PaymentIntentStatus.REQUIRES_PAYMENT,
	)

	db.add(intent)
	db.commit()
	db.refresh(intent)

	return PaymentIntentResponse(
		id=intent.id,
		amount=intent.amount,
		status=intent.status,
	)
