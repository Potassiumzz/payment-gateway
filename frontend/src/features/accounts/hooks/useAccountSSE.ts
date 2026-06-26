import React from "react";
import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";

export function useAccountSSE(onExpiry: () => void) {
	React.useEffect(() => {
		const es = new EventSource(`${BASE_URL}${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}sse`);

		es.onmessage = (e) => {
			const data = JSON.parse(e.data);
			if (data.type === "account_expired") {
				onExpiry();
			}
		};

		es.onerror = () => es.close();

		return () => es.close();
	}, []);
}
