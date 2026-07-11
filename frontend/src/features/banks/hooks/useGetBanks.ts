import { useQuery } from "@/api/hooks/useQuery";
import { QUERY_KEYS } from "@/cache/queryKeys";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { BankResponse } from "@/features/accounts/types/account";

export function useGetBanks() {
	const { data, error, isLoading, errorStatus } = useQuery<BankResponse[]>({
		url: BACKEND_ENDPOINTS.BANKS,
		queryKey: QUERY_KEYS.BANK_LIST,
	});

	return { banksData: data, error, isLoading, errorStatus };
}
