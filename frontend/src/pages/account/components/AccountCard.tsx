import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountResponse } from "@/features/accounts/types/account";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import React from "react";
import { useValidatePin } from "@/features/pin/hooks/useValidatePin";
import { getUnlockedAccounts, markAccountUnlocked } from "@/lib/storage";
import { useDeleteAccount } from "@/features/accounts/hooks/useDeleteAccount";
import { invalidateCacheByPrefix } from "@/cache/queryCache";
import { useRefillAccountBalance } from "@/features/accounts/hooks/useRefillAccountBalance";

type AccountCardProps = {
	account: AccountResponse;
	onSetSender: (account: AccountResponse) => void;
	onSetReceiver: (account: AccountResponse) => void;
	onDelete?: () => void;
};

type CardState = "collapsed" | "pin" | "unlocked";

export function AccountCard({ account, onSetReceiver, onSetSender, onDelete }: AccountCardProps) {
	const [state, setState] = React.useState<CardState>("collapsed");
	const [confirmDelete, setConfirmDelete] = React.useState(false);
	const [pin, setPin] = React.useState("");

	const bodyRef = React.useRef<HTMLDivElement>(null);
	const [bodyHeight, setBodyHeight] = React.useState(0);

	const { validatePin, error, isLoading } = useValidatePin();
	const { deleteAccount, error: deleteErr, isLoading: deleteLoading } = useDeleteAccount();
	const { refillBalance, error: refillErr, isLoading: refillLoading } = useRefillAccountBalance();

	function handleToggle() {
		if (state === "collapsed") {
			const alreadyUnlocked = getUnlockedAccounts().has(account.account_number);
			setState(alreadyUnlocked ? "unlocked" : "pin");
		} else {
			setState("collapsed");
		}
	}

	async function handlePinSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			await validatePin({ pin, account_number: account.account_number });
			markAccountUnlocked(account.account_number);
			setState("unlocked");
		} catch (e) {
			console.log(e);
		}
	}

	async function handleDelete() {
		try {
			await deleteAccount(account.id);
			if (!deleteLoading) {
				console.log("deleted account");
				invalidateCacheByPrefix("ACCOUNT_LIST_");
				onDelete?.();
			}
		} catch (e) {
			console.log(e);
			console.log(deleteErr);
		}
	}

  async function handleRefill() {
    if (account.balance >= 500) return;

    try {
      await refillBalance(account.id);
      if(!refillLoading) {
        console.log("Account refilled");
      }
    } catch (e) {
      console.log(e);
      console.log(refillErr);
    }
  }

	const isOpen = state !== "collapsed";

	React.useEffect(() => {
		if (!bodyRef.current) return;
		if (isOpen) {
			setBodyHeight(bodyRef.current.scrollHeight);
		} else {
			setBodyHeight(0);
		}
	}, [isOpen, state]);

	return (
		<div
			className={cn(
				"w-full border border-border bg-transparent rounded-sm transition-colors duration-150",
				isOpen && "border-border-strong",
			)}
		>
			{/* Header row */}
			<button
				onClick={handleToggle}
				className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-surface-hover transition-colors duration-150"
			>
				<div className="flex items-center gap-5 min-w-0">
					<span className="font-mono text-[11px] text-text-muted shrink-0">#{account.account_number}</span>
					<span className="font-mono text-sm text-text-primary truncate">{account.owner_name}</span>
					<span className="font-mono text-[11px] text-text-muted border border-white/20 px-1.5 py-0.5 rounded-sm shrink-0">
						{account.bank.name}
					</span>
				</div>

				<div className="flex items-center gap-3 shrink-0 ml-4">
					{!account.is_active && (
						<span className="font-mono text-[10px] text-red-400 uppercase tracking-widest">inactive</span>
					)}
					<ChevronDownIcon
						size={14}
						className={cn("text-text-muted transition-transform duration-200", isOpen && "rotate-180")}
					/>
				</div>
			</button>

			{/* Accordion body */}
			<div
				style={{ height: bodyHeight }}
				className="overflow-hidden transition-[height] duration-200 ease-in-out"
			>
				<div ref={bodyRef}>
					<div className="border-t border-border">
						{/* PIN gate */}
						{state === "pin" && (
							<div className="px-5 py-4">
								<form onSubmit={handlePinSubmit} className="space-y-3">
									<p className="font-mono text-xs text-text-muted">Enter PIN to view account details.</p>
									<div className="flex gap-4 items-center">
										<Input
											id="pin"
											type="password"
											placeholder="1234"
											value={pin}
											onChange={(e) => setPin(e.target.value)}
											className="max-w-[120px]"
										/>
										<Button type="submit" size="sm" disabled={isLoading}>
											{isLoading ? "Verifying..." : "Unlock"}
										</Button>
									</div>
									<FieldError message={error || deleteErr} />
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
										{account.expires_at && (
											<p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mt-1">
                        Expires: <span className="text-text-secondary">
                          {new Date(account.expires_at + "Z").toLocaleString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
											</p>
										)}
									</div>

									{/* Actions */}
									<div className="flex flex-wrap gap-2">
										{!confirmDelete ? (
											<>
												<Button size="sm" variant="secondary" onClick={() => onSetSender(account)}>
													Set as sender
												</Button>

												<Button size="sm" variant="secondary" onClick={() => onSetReceiver(account)}>
													Set as receiver
												</Button>

												<Button size="sm" variant="secondary" onClick={handleRefill} disabled={account.balance >= 500}>
													Refill
												</Button>

												{!account.is_default && (
													<Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
														Delete
													</Button>
												)}
											</>
										) : (
											<div className="space-y-3 w-full">
												<p className="font-mono text-xs text-red-400">
													Delete this account? This action cannot be undone through the system.
												</p>

												<div className="flex gap-2">
													<Button
														size="sm"
														variant="secondary"
														onClick={() => setConfirmDelete(false)}
														disabled={deleteLoading}
													>
														Cancel
													</Button>

													<Button size="sm" variant="danger" onClick={handleDelete} disabled={deleteLoading}>
														{deleteLoading ? "Deleting..." : "Yes, delete account"}
													</Button>
												</div>

												<FieldError message={deleteErr} />
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
