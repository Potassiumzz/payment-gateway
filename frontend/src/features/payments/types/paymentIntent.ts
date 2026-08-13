export interface PaymentIntentPayload {
	amount: number;
	returnUrl?: string;
	receiverAccountNumber?: number;
}

export interface PaymentIntentResponse {
	id: string;
	amount: string;
	status: PaymentIntentStatusType;
	returnUrl?: string;
	receiverAccountNumber?: number;
	checkoutUrl: string;
}

export const PaymentIntentStatus = {
	REQUIRES_PAYMENT: "RequiresPayment",
	PENDING: "Pending",
	SUCCEEDED: "Succeeded",
	FAILED: "Failed",
} as const;

export type PaymentIntentStatusType = (typeof PaymentIntentStatus)[keyof typeof PaymentIntentStatus];
