import uuid

from fastapi.exceptions import HTTPException

from app.globals.enums import ResponseError


def generate_intent_id() -> str:
	return f"k_{uuid.uuid4().hex}"


def raise_400_error():
	raise HTTPException(status_code=400, detail=ResponseError.BAD_REQUEST.value)


def raise_401_error():
	raise HTTPException(status_code=401, detail=ResponseError.UNAUTHORISED.value)


def raise_403_error(message: str):
	raise HTTPException(status_code=403, detail=message)


def raise_404_error():
	raise HTTPException(status_code=404, detail=ResponseError.RESOURCE_NOT_FOUND.value)
