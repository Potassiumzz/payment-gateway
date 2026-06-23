import { QUERY_KEYS } from "@/cache/queryKeys";

export type QueryKeyType = keyof typeof QUERY_KEYS | `ACCOUNT_LIST_${number}_${string}`;

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
export function getCache<TResult>(queryKey: QueryKeyType | string): Promise<TResult | undefined> {
	return queryCache.get(queryKey);
}

/**
 * Clears the cache for a specific key.
 *
 * Sets the value to null so future calls know the cache is invalid.
 */
export function invalidateCache(queryKey: QueryKeyType): void {
	queryCache.set(queryKey, null);
	console.log(queryCache);
}

/**
 * Clears the cache for keys with similar string values.
 *
 * Sets the value to null so future calls know the cache is invalid.
 * This is useful when multiple caches with similar values need clearing.
 * For example, for a data that is paginated, and is cached would have key like
 * `ACCOUNT_LIST_1`, `ACCOUNT_LIST_2`, and so on.
 */
export function invalidateCacheByPrefix(prefix: string): void {
	for (const key of queryCache.keys()) {
		if (key.startsWith(prefix)) {
			queryCache.set(key, null);
		}
	}
}
