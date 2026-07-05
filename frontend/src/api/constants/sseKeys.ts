export const SSE_KEYS = {
	ACCOUNT_EXPIRED: "account_expired",
	ACCOUNT_REFILLED: "account_refilled",
} as const;

export type SSEKey = (typeof SSE_KEYS)[keyof typeof SSE_KEYS];
