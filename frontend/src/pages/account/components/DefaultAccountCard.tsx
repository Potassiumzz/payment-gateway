import type { AccountResponse } from "@/features/accounts/types/account";

type Props = {
  label: "Sender" | "Receiver";
  account: AccountResponse | null;
};

export function DefaultAccountCard({ label, account }: Props) {
  return (
    <div className="border border-border rounded-md p-3 bg-surface space-y-1 w-full">
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
      {account ? (
        <>
          <p className="text-sm font-mono text-foreground">{account.owner_name}</p>
          <p className="text-xs text-muted-foreground">#{account.account_number}</p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground italic">Not set</p>
      )}
    </div>
  );
}
