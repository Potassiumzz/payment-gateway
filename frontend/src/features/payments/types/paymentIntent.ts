export interface PaymentIntentPayload {
	amount: number;
	return_url?: string;
	receiver_account_number?: number;
}

export interface PaymentIntentResponse {
	id: string;
	amount: string;
	status: string;
	return_url?: string;
	receiver_account_number?: number;
}
