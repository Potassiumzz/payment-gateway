import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QUERY_KEYS } from "@/cache/queryKeys";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import { INITIAL_FETCH_TIME_MS, MAX_REFETCH_ATTEMPTS } from "@/constants/config";
import { act } from "react";

describe("useQuery", () => {
	const bankData = { id: 1, name: "Bank" };

	let useQuery: typeof import("@/api/hooks/useQuery").useQuery;
	let cache: typeof import("@/cache/queryCache");

	beforeEach(async () => {
		vi.resetModules();
		({ useQuery } = await import("@/api/hooks/useQuery"));
		cache = await import("@/cache/queryCache");
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("sets data after a successful fetch", async () => {
		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => bankData,
		});

		const { result } = renderHook(() =>
			useQuery({ url: BACKEND_ENDPOINTS.BANKS, queryKey: QUERY_KEYS.BANK_LIST }),
		);

		expect(result.current.isLoading).toBe(true);

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(bankData);
		expect(result.current.error).toBeNull();
	});

	it("keeps the rejected promise in cache after a non-retryable error", async () => {
		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: false,
			status: 400,
			json: async () => ({ title: "Bad request" }),
		});

		const { result } = renderHook(() =>
			useQuery({ url: BACKEND_ENDPOINTS.BANKS, queryKey: QUERY_KEYS.BANK_LIST }),
		);

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		await expect(cache.getCache(QUERY_KEYS.BANK_LIST)).rejects.toThrow("Bad request");
		expect(result.current.error).toEqual("Bad request");
		expect(result.current.errorStatus).toEqual(400);
	});

	it("returns cached data without calling fetch, if a cache entry already exists for the query", async () => {
		cache.setCache(QUERY_KEYS.BANK_LIST, Promise.resolve(bankData));

		const { result } = renderHook(() =>
			useQuery<keyof typeof bankData>({ url: BACKEND_ENDPOINTS.BANKS, queryKey: QUERY_KEYS.BANK_LIST }),
		);

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(globalThis.fetch).not.toHaveBeenCalled();
		expect(result.current.data).toEqual(bankData);
	});

	/**
	 * Basically, for data that are fetched by id, they should be stored under a key with
	 * their own id so that the data can be retrieved from the cache correctly based on
	 * the unique id.
	 */
	it("stores the data in cache for id specific key, after fetching", async () => {
		const intentData = { id: 1, amount: 500 };
		const id = "123xyzorsomethinglikethat";

		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => intentData,
		});

		const { result } = renderHook(() =>
			useQuery<{ id: number; amount: number }>({
				url: BACKEND_ENDPOINTS.PAYMENT_INTENTS_ENDPOINT,
				queryKey: QUERY_KEYS.INTENT_DETAIL,
				id: id,
			}),
		);

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(await cache.getCache(`${QUERY_KEYS.INTENT_DETAIL}-${id}`)).toEqual(intentData);

		expect(result.current.data).toEqual(intentData);
		expect(result.current.error).toBeNull();
	});

	it("re-fetches until the max attempts, then stops permanently", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			json: async () => ({ title: "Server error." }),
		});

		const { result } = renderHook(() =>
			useQuery({ url: BACKEND_ENDPOINTS.BANKS, queryKey: QUERY_KEYS.BANK_LIST }),
		);

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		/* drain far more time than the retry backoff could possibly need,
		 * so any lingering/runaway timer would have fired by now if one existed
		 **/
		await act(async () => {
			await vi.advanceTimersByTimeAsync(INITIAL_FETCH_TIME_MS * 15);
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		// exactly 1 initial fetch + MAX_REFETCH_ATTEMPTS retries, never more
		expect(globalThis.fetch).toHaveBeenCalledTimes(MAX_REFETCH_ATTEMPTS + 1);
		expect(vi.getTimerCount()).toEqual(0);

		vi.useRealTimers();
	});
});
