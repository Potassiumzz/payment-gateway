import { getCache, invalidateCache, type QueryKeyType, setCache } from "@/cache/queryCache";
import { INITIAL_FETCH_TIME_MS, MAX_REFETCH_ATTEMPTS } from "@/constants/config";
import { AxiosError } from "axios";
import React from "react";
import { API } from "@/api/config/config";
import type { Endpoint } from "@/api/config/types";

interface IQueryOptions {
	url: Endpoint;
	id?: string;
	queryKey: QueryKeyType;
	config?: {
		headers: {
			[key: string]: string;
		};
	};
}
/**
 * Hook to fetch the data.
 * Uses caching implementation as per the requirement of this project.
 *
 * @param url - API endpoint to hit or fetch the data from.
 * @param queryKey - A unique key for different `url` that was hit.
 * @param id - ID to fetch specific data if needed - optional.
 * @param config - Custom header config options while fetching - optional.
 * Stores data based on the provided `url` and makes caching more efficient.
 */
export function useQuery<TResult>({ url, id, queryKey, config }: IQueryOptions) {
	const [data, setData] = React.useState<TResult | null | unknown>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [refetchAttemptsState, setRefetchAttemptsState] = React.useState<number>(0);

	let refetchTime = INITIAL_FETCH_TIME_MS;
	let refetchAttempts = 0;

	async function fetchData(): Promise<void> {
		setIsLoading(true);

		try {
			const cachedData = await getCache<TResult>(queryKey);
			if (cachedData) return setData(cachedData);

			const res = API<any, TResult>({ method: "GET", endpoint: url, headers: config?.headers, id });
			setCache<TResult>(queryKey, res);
			const result = await res;

			setData(result);
			setError(null);
		} catch (err: unknown) {
			retryFetching();

			if (err instanceof AxiosError) setError(err.message);
			else setError("An unknown error occured. Please try again later.");
		} finally {
			if (!error) setIsLoading(false);
		}
	}

	/**
	 * Refetch the data by running the `fetchData` function recursively.
	 * Only refetch when there is an error while fetching the data initially.
	 *
	 * Refetches until it reaches the max attempts, assigned in `MAX_REFETCH_ATTEMPTS` variable.
	 */
	function retryFetching() {
		invalidateCache(queryKey);
		refetchAttempts++;

		if (refetchAttempts < MAX_REFETCH_ATTEMPTS) {
			refetchTime += refetchTime;
			setRefetchAttemptsState(refetchAttempts);
			setTimeout(fetchData, refetchTime);
		} else {
			setIsLoading(false);
		}
	}

	React.useEffect(() => {
		if (!url) return;

		fetchData();
	}, [url]);
	return { data, error, isLoading, refetchAttemptsState };
}
