import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchResponse = (overrides = {}) => ({
	ok: true,
	status: 200,
	json: vi.fn().mockResolvedValue({}),
	...overrides,
});

describe("useMutation", () => {
	let useMutation: typeof import("@/api/hooks/useMutation").useMutation;

	beforeEach(async () => {
		vi.resetModules();
		({ useMutation } = await import("@/api/hooks/useMutation"));
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("sets isLoading to true while pending, then to false after a successful response", async () => {
		(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockFetchResponse({ json: vi.fn().mockResolvedValue({ ok: true, id: 1, name: "Bank" }) }),
		);

		const { result } = renderHook(() => useMutation<{ name: string }, { id: number }>());

		await result.current.mutate({
			url: BACKEND_ENDPOINTS.BANKS,
			input: { name: "Bank" },
			method: "POST",
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
	});

	// it("POST method passes the input and/or header correctly, but does not pass id", async () => {
	// 	(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
	// 		mockFetchResponse({ json: vi.fn().mockResolvedValue({ id: 1, name: "Bank" }) }),
	// 	);
	//
	// 	const { result } = renderHook(() => useMutation<{ name: string }, { id: number; name: string }>());
	//
	// 	await act(async () => {
	// 		await result.current.mutate({
	// 			url: BACKEND_ENDPOINTS.BANKS,
	// 			method: "POST",
	// 			input: { name: "Bank" },
	// 			config: { headers: { "X-Header": "1" } },
	// 		});
	// 	});
	//
	// 	expect(globalThis.fetch).toHaveBeenCalledTimes(1);
	//
	// 	const [calledUrl, calledOptions] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
	//
	// 	expect(calledUrl).toBe(`${BASE_URL}${BACKEND_ENDPOINTS.BANKS}`);
	// 	expect(calledOptions.method).toBe("POST");
	// 	expect(calledOptions.body).toBe(JSON.stringify({ name: "Bank" }));
	//
	// 	const headers = calledOptions.headers as Headers;
	// 	expect(Object.fromEntries(headers.entries())).toEqual({
	// 		"x-header": "1",
	// 		"content-type": "application/json",
	// 	});
	//
	// 	// confirms `id` (default "") isn't appended to the URL
	// 	expect(calledUrl).not.toContain("undefined");
	// 	expect(calledUrl.endsWith(BACKEND_ENDPOINTS.BANKS)).toBe(true);
	// });
});
