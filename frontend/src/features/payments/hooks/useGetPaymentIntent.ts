import { useQuery } from "@/api/hooks/useQuery";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { PaymentIntentResponse } from "@/features/payments/types/paymentIntent";

export function useGetPaymentIntent(intentId: string) {
	const { data, error, isLoading } = useQuery<PaymentIntentResponse>({
		url: BACKEND_ENDPOINTS.PAYMENT_INTENTS_ENDPOINT,
		queryKey: "intent_detail",
		id: intentId,
	});

	return { intentDetail: data, error, isLoading };
}
