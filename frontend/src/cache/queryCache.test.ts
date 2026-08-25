import { beforeEach, describe, expect, it, vi } from "vitest";
import { QUERY_KEY_PREFIX, QUERY_KEYS } from "@/cache/queryKeys";

describe("queryCache", () => {
	let cache: typeof import("@/cache/queryCache");

	beforeEach(async () => {
		vi.resetModules();
		cache = await import("@/cache/queryCache");
	});

	it("stores and retrieves a promise by key", async () => {
		const accountCache1 = QUERY_KEYS.ACCOUNT_LIST(1, "");
		const accountCache2 = QUERY_KEYS.ACCOUNT_LIST(1, "1");

		cache.setCache(QUERY_KEYS.BANK_LIST, Promise.resolve([{ id: 1 }, { id: 2 }]));
		await expect(cache.getCache(QUERY_KEYS.BANK_LIST)).resolves.toEqual([{ id: 1 }, { id: 2 }]);

		cache.setCache(accountCache1, Promise.resolve([{ id: 1 }, { id: 2 }]));
		await expect(cache.getCache(accountCache1)).resolves.toEqual([{ id: 1 }, { id: 2 }]);

		// The searched value in this case is "1" (just an example), which returns the account with id 1.
		cache.setCache(accountCache2, Promise.resolve([{ id: 1 }]));
		await expect(cache.getCache(accountCache2)).resolves.toEqual([{ id: 1 }]);
	});

	it("returns undefined for a key that was never set", () => {
		expect(cache.getCache(QUERY_KEYS.BANK_LIST)).toBeUndefined();
	});

	it("returns undefined for a key that does not match the existing key", async () => {
		const cachedData = QUERY_KEYS.ACCOUNT_LIST(1, "1");

		cache.setCache(cachedData, Promise.resolve([{ id: 1 }]));
		await expect(cache.getCache(cachedData)).resolves.toEqual([{ id: 1 }]);

		expect(cache.getCache(QUERY_KEYS.ACCOUNT_LIST(1, "searched something"))).toBeUndefined();
	});

	it("invalidateCache nulls the entry instead of removing it", async () => {
		cache.setCache(QUERY_KEYS.BANK_LIST, Promise.resolve([{ id: 1 }]));
		cache.invalidateCache(QUERY_KEYS.BANK_LIST);

		await expect(cache.getCache(QUERY_KEYS.BANK_LIST)).resolves.toBeNull();
	});

	it("invalidateCacheByPrefix only clears matching keys", async () => {
		const page1 = QUERY_KEYS.ACCOUNT_LIST(1, "");
		const page2 = QUERY_KEYS.ACCOUNT_LIST(2, "");

		cache.setCache(page1, Promise.resolve("page1"));
		cache.setCache(page2, Promise.resolve("page2"));
		cache.setCache(QUERY_KEYS.BANK_LIST, Promise.resolve(["banks"]));

		cache.invalidateCacheByPrefix(QUERY_KEY_PREFIX.ACCOUNT_LIST);

		await expect(cache.getCache(page1)).resolves.toBeNull();
		await expect(cache.getCache(page2)).resolves.toBeNull();
		await expect(cache.getCache(QUERY_KEYS.BANK_LIST)).resolves.toEqual(["banks"]);
	});

	it("updateEachCacheEntry transforms all keys sharing a prefix, skipping ones with a null resolved value", async () => {
		const page1 = QUERY_KEYS.ACCOUNT_LIST(1, "");
		const page2 = QUERY_KEYS.ACCOUNT_LIST(2, "");

		cache.setCache(page1, Promise.resolve([{ balance: 100 }]));
		cache.invalidateCache(page2);

		cache.updateEachCacheEntry<{ balance: number }[]>(QUERY_KEY_PREFIX.ACCOUNT_LIST, (cachedData) =>
			cachedData.map((c) => ({ ...c, balance: c.balance + 200 })),
		);

		await Promise.resolve();

		await expect(cache.getCache(page1)).resolves.toEqual([{ balance: 300 }]);
		await expect(cache.getCache(page2)).resolves.toBeNull();
	});

	it("updateEachCacheEntry updates the key only for the cache that matches the specified condition", async () => {
		const account1 = { accountNumber: 1, balance: 300 };
		const account2 = { accountNumber: 2, balance: 500 };
		const account3 = { accountNumber: 3, balance: 800 };

		const page1 = QUERY_KEYS.ACCOUNT_LIST(1, "");
		const page2 = QUERY_KEYS.ACCOUNT_LIST(2, "");

		cache.setCache(page1, Promise.resolve([account1, account2]));
		cache.setCache(page2, Promise.resolve([account3]));

		cache.updateEachCacheEntry<{ accountNumber: number; balance: number }[]>(
			QUERY_KEY_PREFIX.ACCOUNT_LIST,
			(cachedData) =>
				cachedData.map((c) => ({
					...c,
					balance:
						c.accountNumber === 1 ? c.balance + 100 : c.accountNumber === 2 ? c.balance - 100 : c.balance,
				})),
		);

		await Promise.resolve();

		await expect(cache.getCache(page1)).resolves.toEqual([
			{ accountNumber: 1, balance: 400 },
			{ accountNumber: 2, balance: 400 },
		]);
		// untouched account
		await expect(cache.getCache(page2)).resolves.toEqual([{ accountNumber: 3, balance: 800 }]);
	});
});
