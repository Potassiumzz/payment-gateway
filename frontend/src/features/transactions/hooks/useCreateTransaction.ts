import { useMutation } from "@/api/hooks/useMutation";
import {
  CreateTransactionPayload,
  TransactionResponse,
} from "@/features/transactions/types/transaction";
import { TRANSACTIONS_ENDPOINT } from "@/constants/endpoints";

export function useCreateTransaction() {
  const { mutate, error, isLoading } = useMutation<
    CreateTransactionPayload,
    TransactionResponse
  >();

  const createTransactionRequestHeader = {
    "Idempotency-Key": crypto.randomUUID(),
  };

  return {
    createTransaction: (data: CreateTransactionPayload) => {
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
