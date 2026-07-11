const ACCOUNT_LIST = "ACCOUNT_LIST";

export const QUERY_KEYS = {
	INTENT_DETAIL: "INTENT_DETAIL",
	TRANSACTION_DETAIL: "TRANSACTION_DETAIL",
	ACCOUNT_LIST: (page: number, search: string) => `${ACCOUNT_LIST}_${page}_${search}`,
	BANK_LIST: "BANK_LIST",
} as const;

export const QUERY_KEY_PREFIX = {
	ACCOUNT_LIST: ACCOUNT_LIST,
};

export type AccountListKey = ReturnType<typeof QUERY_KEYS.ACCOUNT_LIST>;
