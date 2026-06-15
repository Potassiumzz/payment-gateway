import { cn } from "@/lib/utils";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

type ResultHeaderProps = {
  isSuccess: boolean;
};

export function ResultHeader({ isSuccess }: ResultHeaderProps) {
  const IconComponent = isSuccess ? CheckCircle2Icon : XCircleIcon;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn(
        "w-16 h-16 rounded-full border flex items-center justify-center",
        isSuccess ? "border-secondary/30 bg-secondary/10" : "border-red-500/30 bg-red-500/10"
      )}>
        <IconComponent className={cn("w-7 h-7", isSuccess ? "text-secondary" : "text-red-400")} />
      </div>
      <div className="space-y-1">
        <h1 className={cn("font-mono text-2xl font-bold", isSuccess ? "text-secondary" : "text-red-400")}>
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </h1>
        <p className="font-mono text-xs text-text-muted">
          {isSuccess
            ? "Transaction has been processed and confirmed."
            : "Something went wrong with this transaction."}
        </p>
      </div>
    </div>
  );
}
