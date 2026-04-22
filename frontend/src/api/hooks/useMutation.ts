import { AxiosError } from "axios";
import React from "react";
import { API } from "@/api/config/config";
import type { APIMethods, Endpoint } from "@/api/config/types";

interface IMutateOptions<TInput> {
  url: Endpoint;
  input: TInput;
  config?: {
    headers: {
      [key: string]: string;
    }
  };
  method?: Exclude<APIMethods, "GET">;
}

export function useMutation<TInput, TResult>() {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  async function mutate(mutateOptions: IMutateOptions<TInput>) {
    const { url, input, method = "POST", config } = mutateOptions;
    setIsLoading(true);
    setError(null);

    try {
      switch (method) {
        case "POST":
          return await API<TInput, TResult>({
            method: 'POST', 
            endpoint: url, 
            input: input, 
            headers: config?.headers,
        })
        case "PUT":
          return await API<TInput, TResult>({
            method: 'PUT', 
            endpoint: url, 
            input: input,
        })
        case "DELETE":
          return await API<TInput, TResult>({
            method: 'GET', 
            endpoint: url,
        })
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) setError(err.message);
      else setError("An unknown error occured. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, error, isLoading };
}
