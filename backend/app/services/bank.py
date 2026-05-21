from typing import List

from fastapi import HTTPException

from app.globals.enums import ResponseError
from app.models.bank import Bank
from app.repository.bank import BankRepository
from app.schemas.bank import BankCreate
from app.utils.utils import raise_400_error, raise_404_error


class BankService:
	def __init__(self, repository: BankRepository) -> None:
		self.repository = repository

	def create(self, value: BankCreate) -> Bank:
		if self.repository.exists_by_name(value.name):
			raise HTTPException(
				status_code=400, detail=ResponseError.RESOURCE_EXISTS.value
			)

		return self.repository.create(value)

	def update(self, id: int, value: BankCreate) -> Bank:
		bank = self.repository.get_by_id(id)

		if not bank:
			raise_404_error()

		if self.repository.exists_by_name(value.name):
			raise_400_error()

		bank.name = value.name

		return self.repository.update(bank)

	def delete(self, id: int) -> None:
		bank = self.repository.get_by_id(id)

		if not bank:
			raise_404_error()

		return self.repository.delete(id)

	def get_all(self) -> List[Bank]:
		return self.repository.get_all()

	def get_by_id(self, id: int) -> Bank:
		bank = self.repository.get_by_id(id)
		if not bank:
			raise_404_error()
		return bank
