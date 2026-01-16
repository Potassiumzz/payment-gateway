import { useMutation } from "./useMutation";
import { PAYMENT_INTENTS_ENDPOINT } from "@/constants/endpoints";

interface PaymentIntentResponse {
  id: string;
  amount: string;
  status: string;
}

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
