export interface PaymentIntentPayload {
	amount: number;
	return_url?: string;
}

export interface PaymentIntentResponse {
	id: string;
	amount: string;
	status: string;
	return_url?: string;
}
