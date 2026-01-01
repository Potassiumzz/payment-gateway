from typing import Any

from fastapi import Header, HTTPException
from sqlalchemy.orm import Session

from app.globals.enums import TransactionStatus
from app.models import IdempotencyKey


def get_idempotency_key(idempotency_key: str | None = Header(None)):
	if not idempotency_key:
		raise HTTPException(
			status_code=400, detail="Idempotency-Key header is required"
		)
	return idempotency_key


def get_existing_response(
	db: Session,
	key: str,
	endpoint: str,
):
	return (
		db.query(IdempotencyKey)
		.filter(
			IdempotencyKey.key == key,
			IdempotencyKey.endpoint == endpoint,
		)
		.first()
	)


def save_response(
	db: Session,
	key: str,
	endpoint: str,
	response_body: dict[str, Any],
	status: TransactionStatus,
	failure_reason: str | None,
):
	record = IdempotencyKey(
		key=key,
		endpoint=endpoint,
		response_body=response_body,
		status=status,
		failure_reason=failure_reason,
	)
	db.add(record)
	db.commit()
	db.refresh(record)
