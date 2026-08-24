import type { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export type APIMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Endpoint = (typeof BACKEND_ENDPOINTS)[keyof typeof BACKEND_ENDPOINTS] | AccountEndpoint;

type AccountEndpoint =
	| `${typeof BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}?${string}`
	| `${typeof BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}${number}`;

export interface ApiOptions<T> {
	method: APIMethods;
	endpoint: Endpoint;
	input?: T;
	headers?: {
		[key: string]: string;
	};
	id?: string | T;
}
