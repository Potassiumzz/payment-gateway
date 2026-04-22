export interface PaymentIntentPayload {
	amount: number;
}

export interface PaymentIntentResponse {
	id: string;
	amount: string;
	status: string;
}
