"use client";

import { api } from "@/client/config";
import { AxiosError } from "axios";
import React from "react";

type APIMethods = "post" | "put" | "patch" | "delete";

export function useMutation<TInput, TResult>() {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const mutate = async (
    url: string,
    input: TInput,
    method: APIMethods = "post",
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      switch (method) {
        case "post":
          return await api.post<TResult>(url, input);
        case "put":
          return await api.put<TResult>(url, input);
        case "patch":
          return await api.patch<TResult>(url, input);
        case "delete":
          return await api.delete<TResult>(url, { data: input }); // axios.delete uses `data` for body
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
  };

  return { mutate, error, isLoading };
}
