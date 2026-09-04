from app.models import BankAccount, PaymentIntent, Transaction
from app.schemas import TransactionResponse


def build_transaction_response(
	transaction: Transaction,
	sender: BankAccount,
	receiver: BankAccount,
	intent: PaymentIntent | None = None,
) -> TransactionResponse:
	return TransactionResponse(
		payment_intent_id=transaction.payment_intent_id,
		sender_account_number=sender.account_number,
		sender_owner_name=sender.owner_name,
		sender_bank_name=sender.bank.name,
		receiver_account_number=receiver.account_number,
		receiver_owner_name=receiver.owner_name,
		receiver_bank_name=receiver.bank.name,
		status=transaction.status,
		failure_reason=transaction.failure_reason,
		amount_transferred=transaction.amount_transferred,
		timestamp=transaction.timestamp,
		return_url=intent.return_url if intent else None,
	)
