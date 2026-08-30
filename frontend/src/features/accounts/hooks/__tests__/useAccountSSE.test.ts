import { renderHook } from "@testing-library/react";
import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAccountSSE } from "../useAccountSSE";
import type { SSEResponse } from "../../types/account";
import { SSE_KEYS } from "@/api/constants/sseKeys";

// Minimal mock EventSource
class MockEventSource {
	static instances: MockEventSource[] = [];

	url: string;
	readyState: number = 0; // CONNECTING
	onmessage: ((e: MessageEvent) => void) | null = null;
	onerror: ((e: Event) => void) | null = null;
	close = vi.fn(() => {
		this.readyState = 2; // CLOSED
	});

	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSED = 2;

	constructor(url: string) {
		this.url = url;
		MockEventSource.instances.push(this);
	}
}

describe("useAccountSSE", () => {
	beforeEach(() => {
		MockEventSource.instances = [];
		vi.stubGlobal("EventSource", MockEventSource);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("opens a connection to the correct SSE URL", () => {
		renderHook(() => useAccountSSE(vi.fn()));

		const es = MockEventSource.instances[0];
		expect(es.url).toBe(`${BASE_URL}${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}sse`);
	});

	it("parses account_expired message and calls onMessage", () => {
		const onMessage = vi.fn();
		renderHook(() => useAccountSSE(onMessage));

		const es = MockEventSource.instances[0];
		const payload: SSEResponse = { type: SSE_KEYS.ACCOUNT_EXPIRED, accountNumber: 123 };

		es.onmessage?.({ data: JSON.stringify(payload) } as MessageEvent);

		expect(onMessage).toHaveBeenCalledWith(payload);
	});

	it("does not log an error when the connection was intentionally closed", () => {
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		renderHook(() => useAccountSSE(vi.fn()));

		const es = MockEventSource.instances[0];
		es.readyState = MockEventSource.CLOSED;
		es.onerror?.(new Event("error"));

		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it("logs an error when the connection fails but is not closed", () => {
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		renderHook(() => useAccountSSE(vi.fn()));

		const es = MockEventSource.instances[0];
		es.readyState = MockEventSource.OPEN;
		const errorEvent = new Event("error");
		es.onerror?.(errorEvent);

		expect(consoleErrorSpy).toHaveBeenCalledWith("SSE error", errorEvent);
	});

	it("closes the connection on unmount", () => {
		const { unmount } = renderHook(() => useAccountSSE(vi.fn()));

		const es = MockEventSource.instances[0];
		unmount();

		expect(es.close).toHaveBeenCalledOnce();
	});
});
