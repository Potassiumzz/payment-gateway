import { useMutation } from "@/api/hooks/useMutation";
import type {
	CreateTransactionPayload,
	TransactionResponse,
} from "@/features/transactions/types/transaction";
import { TRANSACTIONS_ENDPOINT } from "@/constants/endpoints";
import { LOCAL_STORAGE_KEYS } from "@/constants/keys";

export function useCreateTransaction() {
	const { mutate, error, isLoading } = useMutation<CreateTransactionPayload, TransactionResponse>();

	return {
		createTransaction: (data: CreateTransactionPayload) => {
			const createTransactionRequestHeader = {
				"Idempotency-Key": "",
			};

			const idempotencyKey = localStorage.getItem(LOCAL_STORAGE_KEYS.idempotencyKey);

			if (idempotencyKey) {
				createTransactionRequestHeader["Idempotency-Key"] = idempotencyKey;
			} else {
				createTransactionRequestHeader["Idempotency-Key"] = crypto.randomUUID();
				localStorage.setItem(
					LOCAL_STORAGE_KEYS.idempotencyKey,
					`${createTransactionRequestHeader["Idempotency-Key"]}`,
				);
			}

			mutate({
				url: TRANSACTIONS_ENDPOINT,
				input: data,
				config: { headers: createTransactionRequestHeader },
			});
		},
		error,
		isLoading,
	};
}
