import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useGetAccounts } from "@/features/accounts/hooks/useGetAccounts";
import { Input } from "@/components/ui/Input";
import { EllipsisLoader } from "@/components/ui/Loader";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks";
import { AccountCard } from "./components/AccountCard";
import { ACCOUNT_PAGE_SIZE } from "@/constants/config";

export function AccountListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { accountList, isLoading, error } = useGetAccounts(page, debouncedSearch);

  const totalPages = accountList ? Math.ceil(accountList.total / ACCOUNT_PAGE_SIZE) : 1;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  }

  return (
    <div className="mx-auto px-6 space-y-6 max-w-3xl w-full">
      <div>
        <h1 className="font-mono text-lg text-foreground">Bank Accounts</h1>
        <p className="text-xs text-muted-foreground mt-1">Search by name or account number. Click an account to verify with PIN.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          id="account-search"
          type="text"
          placeholder="Search by name or account number..."
          value={search}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <EllipsisLoader value="Loading accounts" />
      ) : error ? (
        <p className="text-sm text-red-400 font-mono">Failed to load accounts.</p>
      ) : accountList?.items.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono">No accounts found.</p>
      ) : (
        <div className="space-y-2">
          {accountList?.items.map((account) => (
            <AccountCard key={account.account_number} account={account} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "w-8 h-8 text-xs font-mono rounded border transition-colors",
                p === page
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
