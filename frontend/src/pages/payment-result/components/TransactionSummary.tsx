import { cn } from "@/lib/utils";
import { TransactionStatus, type TransactionResponse } from "@/features/transactions/types/transaction";

type TransactionSummaryProps = {
	transactionDetail: TransactionResponse;
};
export function TransactionSummary({ transactionDetail }: TransactionSummaryProps) {
  const isSuccess = transactionDetail.status === TransactionStatus.Successful;

	return (
		<div
			className={cn(
				"border rounded-sm px-6 py-4 text-xs space-y-2 text-left",
				isSuccess
					? "border-secondary/20 bg-secondary/5"
					: "border-red-500/20 bg-red-500/9",
			)}
		>
			<p className="text-text-muted uppercase tracking-widest text-[10px] mb-3">Transaction summary</p>
      {isSuccess && (
        <div className="flex justify-between">
          <span className="text-text-muted">Amount paid</span>
          <span className="text-text-primary font-semibold">
            ${parseFloat(transactionDetail.amountTransferred).toFixed(2)}
          </span>
        </div>
      )}
			<div className="flex justify-between">
				<span className="text-text-muted">Status</span>
				<span className={cn("font-mono", isSuccess ? "text-secondary" : "text-red-400")}>{isSuccess ? transactionDetail.status : "Failed"}</span>
			</div>
			<div className="border-t border-border my-2" />
			<div className="flex justify-between gap-4">
				<span className="text-text-muted shrink-0">Transaction ID</span>
				<span className="text-text-secondary truncate font-mono">{transactionDetail.paymentIntentId}</span>
			</div>
		</div>
	);
}
