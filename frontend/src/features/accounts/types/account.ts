import type { SSEKey } from "@/api/constants/sseKeys";

export interface CreateAccountPayload {
	ownerName: string;
	bankId: number;
	pin: string;
}

export interface AccountResponse {
	accountNumber: number;
	ownerName: string;
	balance: number;
	isActive: boolean;
	isDefault: boolean;
	expiresAt: string;
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

export interface SSEResponse {
	type: SSEKey;
	accountId: number;
	accountNumber: number;
}
