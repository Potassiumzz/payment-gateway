import { useMutation } from "@/api/hooks/useMutation";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import type { ValidatePinPayload, ValidatePinResponse } from "../types/pin";

export function useValidatePin() {
	const { mutate, error, isLoading } = useMutation<ValidatePinPayload, ValidatePinResponse>();

	return {
		validatePin: (data: ValidatePinPayload) => mutate({ url: BACKEND_ENDPOINTS.PIN, input: data }),
		error,
		isLoading,
	};
}
