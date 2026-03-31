import { useMutation } from "@/api/hooks/useMutation";
import {
  CreateTransactionPayload,
  TransactionResponse,
} from "@/features/transactions/types/transaction";
import { TRANSACTIONS_ENDPOINT } from "@/constants/endpoints";

export function useCreateTransaction() {
  const { mutate, error, isLoading } = useMutation<
    { data: CreateTransactionPayload },
    TransactionResponse
  >();

  return {
    createTransaction: (data: CreateTransactionPayload) =>
      mutate(TRANSACTIONS_ENDPOINT, { data }),
    error,
    isLoading,
  };
}
