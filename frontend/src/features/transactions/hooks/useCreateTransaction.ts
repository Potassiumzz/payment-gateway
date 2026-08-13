import { useMutation } from "@/api/hooks/useMutation";
import type {
	CreateTransactionPayload,
	TransactionResponse,
} from "@/features/transactions/types/transaction";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export function useCreateTransaction() {
	const { mutate, error, isLoading } = useMutation<CreateTransactionPayload, TransactionResponse>();

	return {
		createTransaction: async (data: CreateTransactionPayload): Promise<TransactionResponse> => {
			const createTransactionRequestHeader = {
				"Idempotency-Key": "",
			};

			const idempotencyKey = localStorage.getItem(data.paymentIntentId);

			if (idempotencyKey) {
				createTransactionRequestHeader["Idempotency-Key"] = idempotencyKey;
			} else {
				createTransactionRequestHeader["Idempotency-Key"] = crypto.randomUUID();
				localStorage.setItem(data.paymentIntentId, `${createTransactionRequestHeader["Idempotency-Key"]}`);
			}

			return await mutate({
				url: BACKEND_ENDPOINTS.TRANSACTIONS_ENDPOINT,
				input: data,
				config: { headers: createTransactionRequestHeader },
			});
		},
		error,
		isLoading,
	};
}
