import ErrorPage from "@/components/page/ErrorPage";
import { EllipsisLoader } from "@/components/ui/Loader";
import { useGetPaymentIntent } from "@/features/payments/hooks/useGetPaymentIntent";
import CheckoutForm from "@/pages/checkout/components/CheckoutForm";
import { useParams } from "react-router-dom";

export default function CheckoutPage() {
  const { id } = useParams();
  const { intentDetail, error, isLoading, errorStatus } = useGetPaymentIntent(id!);

  if (isLoading) {
    return <EllipsisLoader value="Fetching payment details" />
  }

  if (error || !intentDetail) {
    return (
      <ErrorPage message={error ?? "Something went wrong."} status={errorStatus ?? 500}/>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        {/* Amount summary */}
        <div className="text-center space-y-1">
          <p className="font-sans text-xs text-text-muted uppercase tracking-widest">
            Amount Due
          </p>
          <p className="font-sans text-4xl font-bold text-text-primary">
            ${parseFloat(intentDetail.amount).toFixed(2)}
          </p>
          <p className="font-mono text-[11px] text-text-muted">
            Intent ID:{" "}
            <span className="text-text-secondary">{intentDetail.id}</span>
          </p>
        </div>

        <CheckoutForm intentDetail={intentDetail} />

      </div>
    </div>
  );
}
