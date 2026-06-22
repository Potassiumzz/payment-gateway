import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountResponse } from "@/features/accounts/types/account";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import React from "react";

type AccountCardProps = {
  account: AccountResponse;
};

type CardState = "collapsed" | "pin" | "unlocked";

export function AccountCard({ account }: AccountCardProps) {
  const [state, setState] = React.useState<CardState>("collapsed");
  const [pin, setPin] = React.useState("");
  const [pinError, setPinError] = React.useState<string | null>(null);

  function handleToggle() {
    if (state === "collapsed") setState("pin");
    else setState("collapsed");
  }

  function handlePinSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setPinError(null);
    setState("unlocked");
  }

  const isOpen = state !== "collapsed";

  return (
    <div className={cn(
      "w-full border border-border bg-surface rounded-sm transition-colors duration-150",
      isOpen && "border-border-strong"
    )}>

      {/* Header row */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-surface-hover transition-colors duration-150"
      >
        <div className="flex items-center gap-5 min-w-0">
          <span className="font-mono text-[11px] text-text-muted shrink-0">
            #{account.account_number}
          </span>
          <span className="font-mono text-sm text-text-primary truncate">
            {account.owner_name}
          </span>
          <span className="font-mono text-[11px] text-text-muted border border-border px-1.5 py-0.5 rounded-sm shrink-0">
            {account.bank.name}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {!account.is_active && (
            <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest">
              inactive
            </span>
          )}
          <ChevronDownIcon
            size={14}
            className={cn(
              "text-text-muted transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Accordion body */}
      {isOpen && (
        <div className="border-t border-border">

          {/* PIN gate */}
          {state === "pin" && (
            <div className="px-5 py-4">
              <form onSubmit={handlePinSubmit} className="space-y-3">
                <p className="font-mono text-xs text-text-muted">
                  Enter PIN to view account details.
                </p>
                <Input
                  id="pin"
                  type="password"
                  placeholder="1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="max-w-[120px]"
                />
                <FieldError message={pinError} />
                <Button type="submit" size="sm">Unlock</Button>
              </form>
            </div>
          )}

          {/* Unlocked */}
          {state === "unlocked" && (
            <div className="px-5 py-5 bg-surface-raised">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

                {/* Balance */}
                <div className="space-y-0.5">
                  <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    Available Balance
                  </p>
                  <p className="font-mono text-3xl font-light text-text-primary tracking-tight">
                    ${account.balance.toFixed(2)}
                  </p>
                  <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mt-1">
                    Expires: <span className="text-text-secondary">N/A</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary">Set as sender</Button>
                  <Button size="sm" variant="secondary">Set as receiver</Button>
                  <Button size="sm" variant="secondary">Refill</Button>
                  <Button size="sm" variant="danger">Delete</Button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
