export interface CreateTransactionPayload {
	paymentIntentId: string;
	senderAccountNumber: number;
	receiverAccountNumber: number;
	securityPin: string;
}

export interface TransactionResponse {
	id: number;
	paymentIntentId: string;
	senderAccountNumber: number;
	senderBankName: string;
	receiverAccountNumber: number;
	receiverOwnerName: string;
	receiverBankName: string;
	status: TransactionStatusType;
	failureReason: string;
	amountTransferred: string;
	timestamp: Date;
	returnUrl?: string;
}

export const TransactionStatus = {
	Successful: "Successful",
	Failure: "Failure",
} as const;

export type TransactionStatusType = (typeof TransactionStatus)[keyof typeof TransactionStatus];
