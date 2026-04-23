import type { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export type APIMethods = "GET" | "POST" | "PUT" | "DELETE";
export type Endpoint = (typeof BACKEND_ENDPOINTS)[keyof typeof BACKEND_ENDPOINTS];

export interface IAPI<T> {
	method: APIMethods;
	endpoint: Endpoint;
	input?: T;
	headers?: {
		[key: string]: string;
	};
	id?: string;
}
