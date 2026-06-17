import ErrorPage from "@/components/page/ErrorPage";
import { useGetPaymentIntent } from "@/features/payments/hooks/useGetPaymentIntent";
import CheckoutForm from "@/pages/checkout/components/CheckoutForm";
import { useParams } from "react-router-dom";

export default function CheckoutPage() {
  const { id } = useParams();
  const { intentDetail, error, isLoading, errorStatus } = useGetPaymentIntent(id!);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="w-3 h-3 border border-text-muted/30 border-t-text-muted rounded-full animate-spin" />
          Fetching payment details...
        </div>
      </main>
    );
  }

  if (error || !intentDetail) {
    return (
      <ErrorPage message={error ?? "Something went wrong."} status={errorStatus ?? 500}/>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-8 xl:py-24">
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
    </main>
  );
}
