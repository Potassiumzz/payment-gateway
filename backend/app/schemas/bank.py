from pydantic import BaseModel


class BankCreate(BaseModel):
	name: str


class BankResponse(BaseModel):
	id: int
	name: str

	class Config:
		orm_mode = True
