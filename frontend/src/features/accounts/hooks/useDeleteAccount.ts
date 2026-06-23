import { useMutation } from "@/api/hooks/useMutation";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export function useDeleteAccount() {
	const { mutate, error, isLoading } = useMutation<number, string>();

	return {
		deleteAccount: (data: number) =>
			mutate({ url: BACKEND_ENDPOINTS.ACCOUNT_ENDPOINT, id: data, method: "DELETE" }),
		error,
		isLoading,
	};
}
