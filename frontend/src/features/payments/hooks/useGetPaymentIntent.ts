import { useQuery } from "@/api/hooks/useQuery";
import { PAYMENT_INTENTS_ENDPOINT } from "@/constants/endpoints";
import { PaymentIntentResponse } from "@/types/paymentIntent";

export function useGetPaymentIntent(intentId: string) {
  const { data, error, isLoading } = useQuery<PaymentIntentResponse>(
    `${PAYMENT_INTENTS_ENDPOINT}${intentId}`,
  );

  return { intentDetail: data, error, isLoading };
}
