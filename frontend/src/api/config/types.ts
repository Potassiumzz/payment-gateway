import type { API_CONFIG } from "@/api/config/config";

export type APIMethods = "GET" | "POST" | "PUT" | "DELETE";

export interface IAPI<T> {
	method: APIMethods;
	endpoint: Endpoint;
	input?: T;
	headers?: {
		[key: string]: string;
	};
}

export type Endpoint = keyof typeof API_CONFIG;
