from enum import Enum


class RouterPrefix(str, Enum):
	BANKS = "/banks"
	ACCOUNTS = "/accounts"
	TRANSACTIONS = "/transactions"
	PAYMENT_INTENTS = "/payment_intents"


class RouterTag(str, Enum):
	BANKS = "Banks"
	ACCOUNTS = "Accounts"
	TRANSACTIONS = "Transactions"
	PAYMENT_INTENTS = "Payment Intents"


class ClassRelation(str, Enum):
	BANK = "Bank"
	BANK_ACCOUNT = "BankAccount"
	TRANSACTION = "Transaction"
	PAYMENT_INTENT = "PaymentIntent"


class TableName(str, Enum):
	BANKS = "banks"
	BANK_ACCOUNTS = "bank_accounts"
	TRANSACTIONS = "transactions"
	IDEMPOTENCY_KEYS = "idempontency_keys"
	PAYMENT_INTENTS = "payment_intents"


class ResponseError(str, Enum):
	RESOURCE_NOT_FOUND = "Resource not found"
	RESOURCE_EXISTS = "Resource already exists"
	BAD_REQUEST = "Bad request"


class TransactionStatus(str, Enum):
	SUCCESSFUL = "Successful"
	FAILURE = "Failure"


class TransactionFailureReason(str, Enum):
	LOW_BALANCE = "LOW_BALANCE"
	SENDER_NOT_FOUND = "SENDER_NOT_FOUND"
	RECEIVER_NOT_FOUND = "RECEIVER_NOT_FOUND"
	SELF_TRANSFER = "SELF_TRANSFER"


class PaymentIntentStatus(str, Enum):
	REQUIRES_PAYMENT = "RequiresPayment"
	PENDING = "Pending"
	SUCCEEDED = "Succeeded"
	FAILED = "Failed"
