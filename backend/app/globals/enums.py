from enum import Enum


class RouterPrefix(str, Enum):
	BANKS = "/banks"
	ACCOUNTS = "/accounts"


class RouterTag(str, Enum):
	BANKS = "Banks"
	ACCOUNTS = "Accounts"


class TableName(str, Enum):
	BANKS = "banks"
	BANK_ACCOUNTS = "bank_accounts"


class ResponseError(str, Enum):
	RESOURCE_NOT_FOUND = "Resource not found"
	RESOURCE_EXISTS = "Resource already exists"
