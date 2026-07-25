import uuid

from fastapi import Header

from app.utils.http_errors import raise_400_error


def generate_intent_id() -> str:
	return f"k_{uuid.uuid4().hex}"


def get_idempotency_key(idempotency_key: str | None = Header(None)) -> str:
	if not idempotency_key:
		raise_400_error("Idempotency-Key header is required.")
	return idempotency_key
