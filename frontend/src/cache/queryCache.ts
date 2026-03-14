import { QUERY_KEYS } from "@/cache/queryKeys";

export type queryKeyType = keyof typeof QUERY_KEYS;
type cacheReturnType<T> = T | undefined;

const queryCache = new Map();

export function setCache<TResult>(queryKey: queryKeyType, data: TResult) {
  queryCache.set(queryKey, data);
}

export function getCache<TResult>(
  queryKey: queryKeyType,
): cacheReturnType<TResult> {
  return queryCache.get(queryKey);
}
