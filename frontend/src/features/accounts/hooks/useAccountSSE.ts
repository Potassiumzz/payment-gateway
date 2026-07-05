import React from "react";
import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";
import type { SSEKey } from "@/api/constants/sseKeys";

export interface SSEResponse {
	type: SSEKey;
	account_id: number;
	account_number: number;
}

export function useAccountSSE(onMessage: (data: SSEResponse) => void) {
	React.useEffect(() => {
		const es = new EventSource(`${BASE_URL}${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}sse`);

		es.onmessage = (e) => {
			const data: SSEResponse = JSON.parse(e.data);
			onMessage(data);
		};

		es.onerror = () => es.close();

		return () => es.close();
	}, []);
}
