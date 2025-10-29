from enum import Enum


class RouterPrefix(str, Enum):
	BANKS = "/banks"


class RouterTag(str, Enum):
	BANKS = "Banks"


class TableName(str, Enum):
	BANKS = "banks"
	BANK_ACCOUNTS = "bank_accounts"
