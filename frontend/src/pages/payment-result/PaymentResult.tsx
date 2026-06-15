import { useParams } from "react-router-dom";
import { useGetTransactionByID } from "@/features/transactions/hooks/useGetTransactionByID";
import { TransactionSummary } from "./components/TransactionSummary";
import { TransactionStatus } from "@/features/transactions/types/transaction";
import { cn } from "@/lib/utils";
import { ResultHeader } from "./components/ResultHeader";
import { ResultActions } from "./components/ResultAction";

export default function PaymentResultPage() {
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

  const isSuccess = !!id && !error && !!transactionDetail && transactionDetail.status === TransactionStatus.Successful;
  const glowColor = isSuccess ? "bg-secondary/5" : "bg-red-500/9";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl", glowColor)} />
      </div>

      <div className="relative w-full max-w-md space-y-6 text-center">
        {transactionDetail && (
          <>
            <ResultHeader isSuccess={isSuccess} failureReason={transactionDetail.failure_reason}/>
            <TransactionSummary transactionDetail={transactionDetail} />
            <ResultActions isSuccess={isSuccess} id={transactionDetail?.payment_intent_id}/>
          </>
        )}
      </div>
    </main>
  );
}
