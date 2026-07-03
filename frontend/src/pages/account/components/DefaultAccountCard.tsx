import { Button } from "@/components/ui/Button";
import type { AccountResponse } from "@/features/accounts/types/account";

type Props = {
  label: "Sender" | "Receiver";
  account: AccountResponse | null;
  onRemove?: () => void;
};

export function DefaultAccountCard({ label, account, onRemove }: Props) {
  return (
    <div className="border border-border rounded-md p-4 bg-surface w-full space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted font-mono uppercase tracking-wider">{label}</p>
        {account && onRemove && (
          <Button
            onClick={onRemove}
            className="border border-white/20 px-2 py-1 text-text-muted hover:text-foreground transition-colors text-xs cursor-pointer hover:bg-background"
            aria-label={`Remove ${label}`}
            variant="ghost"
          >
            Remove
          </Button>
        )}
      </div>
      {account ? (
        <>
          <div>
            <p className="text-sm  text-foreground font-medium">{account.owner_name}</p>
            <p className="text-xs text-text-muted">#{account.account_number}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Available Balance</p>
            <p className="text-lg text-foreground">
              ${account.balance.toFixed(2)}
            </p>
          </div>
        </>
      ) : (
        <p className="text-xs text-text-muted italic">Not set</p>
      )}
    </div>
  );
}
