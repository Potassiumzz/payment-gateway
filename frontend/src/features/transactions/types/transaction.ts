export interface CreateTransactionPayload {
	payment_intent_id: string;
	sender_account_number: number;
	receiver_account_number: number;
	security_pin: string;
}

export interface TransactionResponse {
	id: number;
	payment_intent_id: string;
	sender_account_number: number;
	sender_bank_name: string;
	receiver_account_number: number;
	receiver_owner_name: string;
	receiver_bank_name: string;
	status: TransactionStatusType;
	failure_reason: string;
	amount_transferred: string;
	timestamp: Date;
}

export const TransactionStatus = {
	Successful: "Successful",
	Failure: "Failure",
} as const;

export type TransactionStatusType = (typeof TransactionStatus)[keyof typeof TransactionStatus];
