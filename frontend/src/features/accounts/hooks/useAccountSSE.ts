import React from "react";
import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";
import type { SSEResponse } from "../types/account";

export function useAccountSSE(onMessage: (data: SSEResponse) => void) {
	React.useEffect(() => {
		const es = new EventSource(`${BASE_URL}${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}sse`);

		es.onmessage = (e) => {
			const data: SSEResponse = JSON.parse(e.data);
			onMessage(data);
		};

		es.onerror = (e) => {
			if (es.readyState === EventSource.CLOSED) return; // connection was closed, ignore it in the console log
			console.error("SSE error", e);
		};

		return () => es.close();
	}, []);
}
