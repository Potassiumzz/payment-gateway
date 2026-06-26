export const BACKEND_ENDPOINTS = {
	PAYMENT_INTENTS_ENDPOINT: "/payment_intents/",
	TRANSACTIONS_ENDPOINT: "/transactions/",
	ACCOUNT_ENDPOINT: "/accounts/",
	PIN: "/pin/",
} as const;

export const BASE_URL = import.meta.env.VITE_BASE_URL;
