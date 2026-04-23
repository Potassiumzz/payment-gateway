import type { IAPI } from "@/api/config/types";

const apiHeaders = new Headers();

export async function API<TInput, TResult>({
	method,
	endpoint,
	input,
	headers,
	id = "",
}: IAPI<TInput>): Promise<TResult | unknown> {
	if (headers) {
		const headerKey = Object.keys(headers);
		const headerValue = Object.values(headers);
		apiHeaders.set(headerKey[0], headerValue[0]);
	}

	apiHeaders.append("Content-Type", "application/json");

	try {
		const res = await fetch(`${endpoint}${id}`, {
			method: method,
			headers: apiHeaders,
			body: JSON.stringify({ input }),
		});
		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}
		return await res.json();
	} catch (err) {
		console.log(err);
		return err;
	}
}
