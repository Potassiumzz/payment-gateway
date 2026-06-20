import type { IAPI } from "@/api/config/types";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const apiHeaders = new Headers();

export class ApiError extends Error {
	status: number;
	detail: unknown;

	constructor(status: number, message: string, detail?: unknown) {
		super(message);

		this.name = "ApiError";
		this.status = status;
		this.detail = detail;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export async function API<TInput, TResult>({
	method,
	endpoint,
	input,
	headers,
	id = "",
}: IAPI<TInput>): Promise<TResult> {
	if (headers) {
		const headerKey = Object.keys(headers);
		const headerValue = Object.values(headers);
		apiHeaders.set(headerKey[0], headerValue[0]);
	}

	apiHeaders.set("Content-Type", "application/json");

	let options = {};
	if (method !== "GET") options = { body: JSON.stringify({ ...input }) };

	try {
		const res = await fetch(`${BASE_URL}${endpoint}${id}`, {
			method: method,
			headers: apiHeaders,
			...options,
		});

		if (!res.ok) {
			const errorData = await res.json();

			throw new ApiError(
				res.status,
				Array.isArray(errorData.detail)
					? errorData.detail.map((e: any) => e.msg).join(", ")
					: (errorData.detail ?? `Response status: ${res.status}`),
				errorData.detail,
			);
		}
		return await res.json();
	} catch (err) {
		console.log(err);
		throw err;
	}
}
