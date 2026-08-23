import { useParams } from "react-router-dom";
import { useGetTransactionByID } from "@/features/transactions/hooks/useGetTransactionByID";
import { TransactionSummary } from "./components/TransactionSummary";
import { TransactionStatus } from "@/features/transactions/types/transaction";
import { cn } from "@/lib/utils";
import { ResultHeader } from "./components/ResultHeader";
import { ResultActions } from "./components/ResultAction";
import { EllipsisLoader } from "@/components/ui/Loader";
import ErrorPage from "@/components/page/ErrorPage";

export default function PaymentResultPage() {
  const { intentId } = useParams();
  const { transactionDetail, error, isLoading, errorStatus } = useGetTransactionByID(intentId!);

  if (isLoading) {
    return <EllipsisLoader value="Verifying transaction"/>
  }

  if (errorStatus === 422) {
    return <ErrorPage status={422} />
  }

  if (error) {
    return (
      <ErrorPage message={error ?? "Something went wrong."} status={errorStatus ?? 500}/>
    );
  }

  const isSuccess = !!intentId && !error && !!transactionDetail && transactionDetail.status === TransactionStatus.Successful;
  const glowColor = isSuccess ? "bg-secondary/5" : "bg-red-500/9";

  return (
    <div className="flex flex-col items-center justify-center px-6 bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl", glowColor)} />
      </div>

      <div className="relative w-full max-w-md space-y-6 text-center">
        {transactionDetail && (
          <>
            <ResultHeader isSuccess={isSuccess} failureReason={transactionDetail.failureReason}/>
            <TransactionSummary transactionDetail={transactionDetail} />
            <ResultActions isSuccess={isSuccess} id={transactionDetail?.paymentIntentId} returnUrl={transactionDetail?.returnUrl} />
          </>
        )}
      </div>
    </div>
  );
}
