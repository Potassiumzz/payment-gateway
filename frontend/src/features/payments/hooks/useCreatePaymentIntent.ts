import { useMutation } from "@/api/hooks/useMutation";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { PaymentIntentPayload, PaymentIntentResponse } from "@/features/payments/types/paymentIntent";

export function useCreatePaymentIntent() {
	const { mutate, error, isLoading } = useMutation<PaymentIntentPayload, PaymentIntentResponse>();

	return {
		createIntent: (data: PaymentIntentPayload) =>
			mutate({ url: BACKEND_ENDPOINTS.PAYMENT_INTENTS_ENDPOINT, input: data }),
		error,
		isLoading,
	};
}
