import { QUERY_KEYS } from "@/cache/queryKeys";

export type queryKeyType = keyof typeof QUERY_KEYS;

export const queryCache = new Map<queryKeyType, string | number | object>();
