import React from "react";
import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";

export interface SSEResponse {
	type: string;
	account_id: number;
	account_number: number;
}

export function useAccountSSE(onExpiry: (data: SSEResponse) => void) {
	React.useEffect(() => {
		const es = new EventSource(`${BASE_URL}${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}sse`);

		es.onmessage = (e) => {
			const data: SSEResponse = JSON.parse(e.data);
			if (data.type === "account_expired") {
				onExpiry(data);
			}
		};

		es.onerror = () => es.close();

		return () => es.close();
	}, []);
}
