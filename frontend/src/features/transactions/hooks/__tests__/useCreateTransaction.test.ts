import { renderHook } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateTransactionPayload } from "../../types/transaction";

describe("useCreateTransaction", () => {
	const localStorageMock: Omit<Storage, "key"> = (() => {
		let store: Record<string, string> = {};

		return {
			getItem: (key: string): string => store[key] ?? null,
			setItem: (key: string, value: string): void => {
				store[key] = value.toString();
			},
			removeItem: (key: string): void => {
				delete store[key];
			},
			clear: (): void => {
				store = {};
			},
			length: Object.keys(store).length,
		};
	})();

	const idempotencyKeyString = "Idempotency-Key";
	let useCreateTransaction: typeof import("@/features/transactions/hooks/useCreateTransaction").useCreateTransaction;
	let originalLocalStorage: Storage;

	const transactionPayload = {
		paymentIntentId: "paymentIntentId",
		senderAccountNumber: 123,
		receiverAccountNumber: 456,
		securityPin: "1010",
	} satisfies CreateTransactionPayload;

	beforeEach(async () => {
		({ useCreateTransaction } = await import("@/features/transactions/hooks/useCreateTransaction"));
		vi.clearAllMocks();
		globalThis.fetch = vi.fn();
		originalLocalStorage = window.localStorage;
		(window as any).localStorage = localStorageMock;
	});

	afterEach(() => {
		localStorage.clear();
		(window as any).localStorage = originalLocalStorage;
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it("sets the key in header when sending the POST request under key 'Idempotency-Key'", async () => {
		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			json: async () => ({ key: "value" }),
		});

		const { result } = renderHook(() => useCreateTransaction());
		await act(() => result.current.createTransaction(transactionPayload));
		expect((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers as Headers).not.toBeNull();
	});

	it("creates idempotency key if not already available in localStorage", async () => {
		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			json: async () => ({
				amount: 1000,
			}),
		});

		const { result } = renderHook(() => useCreateTransaction());
		const uuidMock = vi
			.spyOn(globalThis.crypto, "randomUUID")
			.mockReturnValue("random-uuid-value-or-something-like-that-i-guess");
		expect(localStorage.getItem(transactionPayload.paymentIntentId)).toBeNull();

		await act(async () => await result.current.createTransaction(transactionPayload));

		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
		expect(uuidMock).toHaveBeenCalledTimes(1);
		expect(localStorage.getItem(transactionPayload.paymentIntentId)).not.toBeNull();

		const header = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers as Headers;
		expect(header.get(idempotencyKeyString)).toEqual(uuidMock());
	});

	it("retrieves idempotency-key from localStorage if available", async () => {
		const uuidMock = vi
			.spyOn(globalThis.crypto, "randomUUID")
			.mockReturnValue("already-existing-idempotency-key-localStorage");
		localStorage.setItem(transactionPayload.paymentIntentId, "already-existing-idempotency-key-localStorage");

		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			json: async () => ({ key: "value" }),
		});

		const { result } = renderHook(() => useCreateTransaction());
		await act(async () => await result.current.createTransaction(transactionPayload));

		expect(uuidMock).not.toHaveBeenCalled();

		const header = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers as Headers;
		expect(header.get(idempotencyKeyString)).toEqual(uuidMock());
	});
});
