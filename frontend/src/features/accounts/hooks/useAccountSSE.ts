import React from "react";
import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";

interface SSEResponse {
	type: string;
	account_id: number;
}

export function useAccountSSE(onExpiry: (accountId: number) => void) {
	React.useEffect(() => {
		const es = new EventSource(`${BASE_URL}${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}sse`);

		es.onmessage = (e) => {
			const data: SSEResponse = JSON.parse(e.data);
			if (data.type === "account_expired") {
				onExpiry(data.account_id);
			}
		};

		es.onerror = () => es.close();

		return () => es.close();
	}, []);
}
