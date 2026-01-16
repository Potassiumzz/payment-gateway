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
      let result;
      if (method === "post") {
        result = await api.post<TResult>(url, input);
      } else if (method === "put") {
        result = await api.put<TResult>(url, input);
      } else if (method === "patch") {
        result = await api.patch<TResult>(url, input);
      } else if (method === "delete") {
        result = await api.delete<TResult>(url, { data: input }); // axios.delete uses `data` for body
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }

      return result.data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) setError(err.message);
      else setError("Unknown error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, error, isLoading };
}
