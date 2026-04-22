import { QUERY_KEYS } from "@/cache/queryKeys";

export type QueryKeyType = keyof typeof QUERY_KEYS;

const queryCache = new Map();

/**
 * Saves a request promise in the cache.
 *
 * The promise is stored instead of resolved data so that
 * multiple calls with the same key can share the same request.
 */
export function setCache<TResult>(queryKey: QueryKeyType, data: Promise<TResult | unknown>): void {
	queryCache.set(queryKey, data);
}

/**
 * Gets a cached request promise by key.
 *
 * Returns the stored promise if it exists, otherwise undefined.
 */
export function getCache<TResult>(queryKey: QueryKeyType): Promise<TResult | undefined> {
	return queryCache.get(queryKey);
}

/**
 * Clears the cache for a specific key.
 *
 * Sets the value to null so future calls know the cache is invalid.
 */
export function invalidateCache(queryKey: QueryKeyType): void {
	queryCache.set(queryKey, null);
}
