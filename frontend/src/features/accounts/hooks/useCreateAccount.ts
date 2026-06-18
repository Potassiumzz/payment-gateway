import { useMutation } from "@/api/hooks/useMutation";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { AccountResponse, CreateAccountPayload } from "@/features/accounts/types/account";

export function useCreateAccount() {
	const { mutate, error, isLoading } = useMutation<CreateAccountPayload, AccountResponse>();

	return {
		createIntent: (data: CreateAccountPayload) =>
			mutate({ url: BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT, input: data }),
		error,
		isLoading,
	};
}
