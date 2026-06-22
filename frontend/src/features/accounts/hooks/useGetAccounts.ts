import { useQuery } from "@/api/hooks/useQuery";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { AccountResponse } from "@/features/accounts/types/account";

export function useGetAccounts() {
	const { data, errorStatus, error, isLoading } = useQuery<AccountResponse[]>({
		url: BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT,
		queryKey: "account_list",
	});

	return { accountList: data, error, isLoading, errorStatus };
}
