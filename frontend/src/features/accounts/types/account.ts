export interface CreateAccountPayload {
	owner_name: string;
	bank_id: number;
	pin: string;
}

export interface AccountResponse {
	account_number: number;
	owner_name: string;
	balance: number;
	is_active: boolean;
	// bank: BankResponse
}
