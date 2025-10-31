from enum import Enum


class RouterPrefix(str, Enum):
	BANKS = "/banks"


class RouterTag(str, Enum):
	BANKS = "Banks"


class TableName(str, Enum):
	BANKS = "banks"
	BANK_ACCOUNTS = "bank_accounts"


class RouteDescriptions(str, Enum):
	CREATE_BANK = "Create a new bank."
	GET_ALL_BANKS = "Get a list of all banks."
	GET_BANK = "Get a specific bank by its ID"
	UPDATE_BANK = "Update an existing bank's name by its ID"
	DELETE_BANK = "Delete an existing bank by its ID"
