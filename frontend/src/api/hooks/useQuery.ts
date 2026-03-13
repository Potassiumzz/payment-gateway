"use client";

import { api } from "@/client/config";
import { AxiosError } from "axios";
import React from "react";

export function useQuery<TResult>(url: string) {
  const [data, setData] = React.useState<TResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!url) return;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.get<TResult>(url);
        setData(res.data);
        return res;
      } catch (err: unknown) {
        if (err instanceof AxiosError) setError(err.message);
        else setError("An unknown error occured. Please try again later.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [url]);
  return { data, error, isLoading };
}
