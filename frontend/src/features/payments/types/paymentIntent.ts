export interface PaymentIntentPayload {
	amount: number;
	return_url?: string;
	receiver_account_number?: number;
}

export interface PaymentIntentResponse {
	id: string;
	amount: string;
	status: PaymentIntentStatusType;
	return_url?: string;
	receiver_account_number?: number;
	checkout_url: string;
}

export const PaymentIntentStatus = {
	REQUIRES_PAYMENT: "RequiresPayment",
	PENDING: "Pending",
	SUCCEEDED: "Succeeded",
	FAILED: "Failed",
} as const;

export type PaymentIntentStatusType = (typeof PaymentIntentStatus)[keyof typeof PaymentIntentStatus];
