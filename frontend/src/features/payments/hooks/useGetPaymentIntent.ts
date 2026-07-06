import { useQuery } from "@/api/hooks/useQuery";
import { QUERY_KEYS } from "@/cache/queryKeys";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { PaymentIntentResponse } from "@/features/payments/types/paymentIntent";

export function useGetPaymentIntent(intentId: string) {
	const { data, error, isLoading, errorStatus } = useQuery<PaymentIntentResponse>({
		url: BACKEND_ENDPOINTS.PAYMENT_INTENTS_ENDPOINT,
		queryKey: QUERY_KEYS.INTENT_DETAIL,
		id: intentId,
	});

	return { intentDetail: data, error, isLoading, errorStatus };
}
