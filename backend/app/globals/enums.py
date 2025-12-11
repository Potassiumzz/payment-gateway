from enum import Enum


class RouterPrefix(str, Enum):
	BANKS = "/banks"
	ACCOUNTS = "/accounts"
	TRANSACTIONS = "/transactions"


class RouterTag(str, Enum):
	BANKS = "Banks"
	ACCOUNTS = "Accounts"
	TRANSACTIONS = "Transactions"


class ClassRelation(str, Enum):
	BANK = "Bank"
	BANK_ACCOUNT = "BankAccount"
	TRANSACTION = "transaction"


class TableName(str, Enum):
	BANKS = "banks"
	BANK_ACCOUNTS = "bank_accounts"
	TRANSACTIONS = "transactions"


class ResponseError(str, Enum):
	RESOURCE_NOT_FOUND = "Resource not found"
	RESOURCE_EXISTS = "Resource already exists"
	BAD_REQUEST = "Bad request"


class TransactionStatus(str, Enum):
	SUCCESSFUL = "Successful"
	FAILURE = "Failure"
	PENDING = "Pending"


class TransactionFailureReason(str, Enum):
	LOW_BALANCE = "LOW_BALANCE"
	SENDER_NOT_FOUND = "SENDER_NOT_FOUND"
	RECEIVER_NOT_FOUND = "RECEIVER_NOT_FOUND"
	SELF_TRANSFER = "SELF_TRANSFER"
