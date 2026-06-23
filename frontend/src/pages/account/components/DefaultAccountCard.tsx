import type { AccountResponse } from "@/features/accounts/types/account";

type Props = {
  label: "Sender" | "Receiver";
  account: AccountResponse | null;
};

export function DefaultAccountCard({ label, account }: Props) {
  return (
    <div className="border border-border rounded-md p-4 bg-surface w-full space-y-3">
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
      {account ? (
        <>
          <div>
            <p className="text-sm font-mono text-foreground font-medium">{account.owner_name}</p>
            <p className="text-xs text-text-muted font-mono">#{account.account_number}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Available Balance</p>
            <p className="text-lg font-mono text-foreground">
              ${account.balance.toFixed(2)}
            </p>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground italic font-mono">Not set</p>
      )}
    </div>
  );
}
