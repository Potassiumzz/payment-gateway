from fastapi import APIRouter, Depends

from app.dependencies.payment_intent import PaymentIntentDependencies
from app.globals.enums import RouterPrefix, RouterTag
from app.schemas import PaymentIntentCreate
from app.schemas.payment_intent import PaymentIntentResponse
from app.services.payment_intent import PaymentIntentService

router = APIRouter(
	prefix=RouterPrefix.PAYMENT_INTENTS.value, tags=[RouterTag.PAYMENT_INTENTS.value]
)


@router.post(
	"/",
	response_model=PaymentIntentResponse,
	description="Create payment intent. This represents when a payment intent is being created. It should not be created by the user themselves, and the value is supposed to come from the backend of the merchant directly.",
)
def create_payment_intent(
	value: PaymentIntentCreate,
	service: PaymentIntentService = Depends(PaymentIntentDependencies.get_service),
):
	service.create(value)


@router.get(
	"/{intent_id}",
	response_model=PaymentIntentResponse,
	description="Get payment intent detail. The payment intent consists of the actual amount to be paid, the status of the intent, and the id.",
)
def get_payment_intent(
	intent_id: str,
	service: PaymentIntentService = Depends(PaymentIntentDependencies.get_service),
):
	service.get_intent_details(intent_id)
