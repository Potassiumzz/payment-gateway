import type { IAPI } from "@/api/config/types";

export const API_CONFIG = {
  "/payment_intents": ["GET", "POST"],
  "/transactions/": ["GET", "POST"],
} as const;

const apiHeaders = new Headers();

export async function API<TInput, TResult>({method, endpoint, input, headers} : IAPI<TInput>): Promise<TResult | unknown> {
  if(headers) {
    const headerKey = Object.keys(headers);
    const headerValue = Object.values(headers);
    apiHeaders.set(headerKey[0], headerValue[0]);
  }

  apiHeaders.append("Content-Type", "application/json");

  try {
    const res = await fetch(`${endpoint}`, {
      method: method, 
      headers: apiHeaders,
      body: JSON.stringify({input}), 
    });
    if(!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }
    return await res.json();
  } catch(err) {
    console.log(err);
    return err;
  }
}
