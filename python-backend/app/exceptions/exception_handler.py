from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def register_exception_handlers(app: FastAPI) -> None:
	@app.exception_handler(StarletteHTTPException)
	async def http_exception_handler(request: Request, exc: StarletteHTTPException):  # pyright: ignore[reportUnusedFunction]
		return JSONResponse(
			status_code=exc.status_code,
			content={"status": exc.status_code, "title": exc.detail},
		)

	@app.exception_handler(RequestValidationError)
	async def validation_exception_handler(  # pyright: ignore[reportUnusedFunction]
		request: Request, exc: RequestValidationError
	):
		return JSONResponse(
			status_code=422,
			content={
				"status": 422,
				"title": "Validation failed.",
				"detail": exc.errors(),
			},
		)
