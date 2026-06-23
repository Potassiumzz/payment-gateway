export interface CreateAccountPayload {
	owner_name: string;
	bank_id: number;
	pin: string;
}

export interface AccountResponse {
	id: number;
	account_number: number;
	owner_name: string;
	balance: number;
	is_active: boolean;
	is_default: boolean;
	expires_at: string;
	bank: BankResponse;
}

export interface AccountListResponse {
	items: AccountResponse[];
	total: number;
	page: number;
	limit: number;
}

export interface BankResponse {
	id: number;
	name: string;
}
