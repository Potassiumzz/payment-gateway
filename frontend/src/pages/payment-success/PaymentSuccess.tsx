import { useParams } from "react-router-dom";
import { useGetTransactionByID } from "@/features/transactions/hooks/useGetTransactionByID";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import { CheckIcon } from "lucide-react";

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const { transactionDetail, error, isLoading } = useGetTransactionByID(id!);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="w-3 h-3 border border-text-muted/30 border-t-text-muted rounded-full animate-spin" />
          Verifying transaction...
        </div>
      </main>
    );
  }

  const failed = !id || error || !transactionDetail || transactionDetail.status === "Failure";

  if (failed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-background">
        {/* Red ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md space-y-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-2xl">✕</span>
            </div>
            <div className="space-y-1">
              <h1 className="font-mono text-2xl font-bold text-red-400">
                Payment Failed
              </h1>
              <p className="font-mono text-xs text-text-muted">
                {error ?? "Something went wrong with this transaction."}
              </p>
            </div>
          </div>

          <div className="border border-red-500/20 bg-red-500/5 rounded-sm px-6 py-4 font-mono text-xs space-y-2 text-left">
            <p className="text-text-muted uppercase tracking-widest text-[10px] mb-3">
              Transaction result
            </p>
            <div className="flex justify-between">
              <span className="text-text-muted">Status</span>
              <span className="text-red-400">failed</span>
            </div>
            {id && (
              <div className="flex justify-between gap-4">
                <span className="text-text-muted shrink-0">Transaction ID</span>
                <span className="text-text-secondary truncate">{id}</span>
              </div>
            )}
          </div>

          <Link
            to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE}
            className="inline-flex items-center gap-2 border border-border hover:border-border-strong text-text-secondary hover:text-text-primary font-mono text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors duration-150"
          >
            ← Try again
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-background">
      {/* Green ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-secondary/30 bg-secondary/10 flex items-center justify-center">
            <span className="text-secondary text-2xl"><CheckIcon /></span>
          </div>
          <div className="space-y-1">
            <h1 className="font-mono text-2xl font-bold text-secondary">
              Payment Successful
            </h1>
            <p className="font-mono text-xs text-text-muted">
              Transaction has been processed and confirmed.
            </p>
          </div>
        </div>

        {/* Transaction summary */}
        <div className="border border-secondary/20 bg-secondary/5 rounded-sm px-6 py-4 font-mono text-xs space-y-2 text-left">
          <p className="text-text-muted uppercase tracking-widest text-[10px] mb-3">
            Transaction summary
          </p>
          <div className="flex justify-between">
            <span className="text-text-muted">Amount paid</span>
            <span className="text-text-primary font-semibold">
              ${parseFloat(transactionDetail.amount_transferred).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Status</span>
            <span className="text-secondary">{transactionDetail.status}</span>
          </div>
          <div className="border-t border-border my-2" />
          <div className="flex justify-between gap-4">
            <span className="text-text-muted shrink-0">Transaction ID</span>
            <span className="text-text-secondary truncate">{transactionDetail.id}</span>
          </div>
        </div>

        <Link
          to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE}
          className="inline-flex items-center gap-2 border border-border hover:border-border-strong text-text-secondary hover:text-text-primary font-mono text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors duration-150"
        >
          New simulation
        </Link>
      </div>
    </main>
  );
}
