import type { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export type APIMethods = "GET" | "POST" | "PUT" | "DELETE";
export type Endpoint =
	| (typeof BACKEND_ENDPOINTS)[keyof typeof BACKEND_ENDPOINTS]
	| `${typeof BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}?${string}`;

export interface IAPI<T> {
	method: APIMethods;
	endpoint: Endpoint;
	input?: T;
	headers?: {
		[key: string]: string;
	};
	id?: string;
}
