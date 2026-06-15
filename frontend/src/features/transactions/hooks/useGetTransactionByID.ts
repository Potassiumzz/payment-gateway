import { useQuery } from "@/api/hooks/useQuery";
import type { TransactionResponse } from "../types/transaction";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export function useGetTransactionByID(transactionId: string) {
	const { data, error, errorStatus, isLoading } = useQuery<TransactionResponse>({
		url: BACKEND_ENDPOINTS.TRANSACTIONS_ENDPOINT,
		queryKey: "transaction_detail",
		id: transactionId,
	});

	return { transactionDetail: data, error, errorStatus, isLoading };
}
