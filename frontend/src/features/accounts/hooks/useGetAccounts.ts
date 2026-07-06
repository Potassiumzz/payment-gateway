import { useQuery } from "@/api/hooks/useQuery";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { AccountListResponse } from "../types/account";
import { ACCOUNT_PAGE_SIZE } from "@/constants/config";

export function useGetAccounts(page: number, search: string) {
	const params = new URLSearchParams();
	if (search) params.set("search", search);
	params.set("page", String(page));
	params.set("limit", String(ACCOUNT_PAGE_SIZE));

	const queryKey = `ACCOUNT_LIST_${page}_${search}` as const;

	const { data, errorStatus, error, isLoading } = useQuery<AccountListResponse>({
		url: `${BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT}?${params.toString()}`,
		queryKey,
	});

	return { accountList: data, error, isLoading, errorStatus };
}
