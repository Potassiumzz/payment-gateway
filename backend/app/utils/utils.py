import uuid

from fastapi.exceptions import HTTPException

from app.globals.enums import ResponseError


def generate_intent_id() -> str:
	return f"k_{uuid.uuid4().hex}"


def raise_404_error():
	raise HTTPException(status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value)


def raise_400_error():
	raise HTTPException(status_code=400, detail=ResponseError.RESOURCE_EXISTS.value)
