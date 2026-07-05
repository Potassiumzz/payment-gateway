import { useMutation } from "@/api/hooks/useMutation";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { AccountResponse } from "@/features/accounts/types/account";

export function useRefillAccountBalance() {
	const { mutate, error, isLoading } = useMutation<number, AccountResponse>();

	return {
		refillBalance: (id: number) =>
			mutate({ url: `${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}refill/`, id, method: "PUT" }),
		error,
		isLoading,
	};
}
