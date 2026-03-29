import { useMutation } from "@/api/hooks/useMutation";
import { PAYMENT_INTENTS_ENDPOINT } from "@/constants/endpoints";
import { PaymentIntentResponse } from "@/types/paymentIntent";

export function useCreatePaymentIntent() {
  const { mutate, error, isLoading } = useMutation<
    { amount: number },
    PaymentIntentResponse
  >();

  return {
    createIntent: (amount: number) =>
      mutate(PAYMENT_INTENTS_ENDPOINT, { amount }),
    error,
    isLoading,
  };
}
