from app.models import IdempotencyKey
from app.repository.idempotency import IdempotencyRepository
from app.schemas.idempotency import IdempotencyRequest


class IdempotencyService:
	def __init__(self, repository: IdempotencyRepository) -> None:
		self.repository = repository

	def save_response(self, value: IdempotencyRequest) -> IdempotencyKey:
		record = IdempotencyKey(
			key=value.key,
			endpoint=value.endpoint,
			response_body=value.response_body,
			status=value.status,
			failure_reason=value.failure_reason,
		)
		return self.repository.save(record)

	def get_existing_response(self, key: str, endpoint: str) -> IdempotencyKey:
		return self.repository.get_existing_response(key, endpoint)
