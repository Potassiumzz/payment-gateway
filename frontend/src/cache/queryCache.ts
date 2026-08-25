import { QUERY_KEYS, type AccountListKey } from "@/cache/queryKeys";

export type QueryKeyType = keyof typeof QUERY_KEYS | AccountListKey;

const queryCache = new Map();

/**
 * Saves a request promise in the cache.
 *
 * The promise is stored instead of resolved data so that
 * multiple calls with the same key can share the same request.
 */
export function setCache<TResult>(queryKey: QueryKeyType, data: Promise<TResult>): void {
	queryCache.set(queryKey, data);
}

/**
 * Gets a cached request promise by key.
 *
 * Returns the stored promise if it exists, otherwise undefined.
 */
export function getCache<TResult>(queryKey: QueryKeyType | string): Promise<TResult> {
	return queryCache.get(queryKey);
}

/**
 * Clears the cache for a specific key.
 *
 * Sets the value to null so future calls know the cache is invalid.
 */
export function invalidateCache(queryKey: QueryKeyType): void {
	queryCache.set(queryKey, Promise.resolve(null));
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
			queryCache.set(key, Promise.resolve(null));
		}
	}
}

/**
 * Update specific entry from the cache for all matching keys prefix.
 *
 * For example, a cache for the same data could be stored under different keys.
 * Use this function to update a specific value for all those cache keys.
 */
export function updateEachCacheEntry<T>(prefix: string, updater: (value: T) => T): void {
	for (const key of queryCache.keys()) {
		if (!key.startsWith(prefix)) continue;
		getCache<T>(key).then((res) => {
			if (!res) return;
			setCache(key, Promise.resolve(updater(res)));
		});
	}
}
