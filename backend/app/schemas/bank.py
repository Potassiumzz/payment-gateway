from pydantic import BaseModel, ConfigDict


class BankCreate(BaseModel):
	name: str


class BankResponse(BaseModel):
	id: int
	name: str

	class Config:
		model_config = ConfigDict(from_attributes=True)
