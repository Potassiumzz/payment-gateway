export const SSE_KEYS = {
	ACCOUNT_EXPIRED: "account_expired",
} as const;

export type SSEKey = (typeof SSE_KEYS)[keyof typeof SSE_KEYS];
