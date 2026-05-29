from typing import NoReturn

from fastapi.exceptions import HTTPException

from app.globals.enums import ResponseError


def raise_http_error(
	status_code: int, default_message: str, message: str | None = None
) -> NoReturn:
	raise HTTPException(status_code=status_code, detail=message or default_message)


def raise_400_error(message: str | None = None) -> NoReturn:
	raise_http_error(400, ResponseError.BAD_REQUEST.value, message)


def raise_401_error(message: str | None = None) -> NoReturn:
	raise_http_error(401, ResponseError.UNAUTHORISED.value, message)


def raise_403_error(message: str | None = None) -> NoReturn:
	raise_http_error(403, ResponseError.FORBIDDEN.value, message)


def raise_404_error(message: str | None = None) -> NoReturn:
	raise_http_error(404, ResponseError.RESOURCE_NOT_FOUND.value, message)


def raise_500_error(message: str | None = None) -> NoReturn:
	raise_http_error(500, ResponseError.SERVER_ERROR.value, message)
