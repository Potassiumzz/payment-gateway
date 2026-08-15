from app.schemas.base import CamelModel, CamelResponseModel


class BankCreate(CamelModel):
	name: str


class BankResponse(CamelResponseModel):
	id: int
	name: str
