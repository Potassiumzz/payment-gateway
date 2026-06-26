import React from "react";
import { SearchIcon } from "lucide-react";
import { useGetAccounts } from "@/features/accounts/hooks/useGetAccounts";
import { Input } from "@/components/ui/Input";
import { EllipsisLoader } from "@/components/ui/Loader";
import { useDebounce, useDefaultAccounts } from "@/lib/hooks";
import { AccountCard } from "./components/AccountCard";
import { ACCOUNT_PAGE_SIZE } from "@/constants/config";
import { DefaultAccountCard } from "./components/DefaultAccountCard";
import { Link } from "react-router-dom";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/Button";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { removeDefaultReceiver, removeDefaultSender } from "@/lib/storage";
import { useAccountSSE } from "@/features/accounts/hooks/useAccountSSE";
import { invalidateCacheByPrefix } from "@/cache/queryCache";
import { InputProgressBar } from "@/components/ui/InputProgressBar";

export function AccountListPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebounce(search);

  const { accountList, isLoading, error, refetch } = useGetAccounts(page, debouncedSearch);

  const totalPages = accountList ? Math.ceil(accountList.total / ACCOUNT_PAGE_SIZE) : 1;

  const { sender, receiver, setSender, setReceiver } = useDefaultAccounts();

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  }

  function handleAccountSSERefetch(accountId: number) {
      if (sender?.id === accountId) {
          removeDefaultSender();
          setSender(null);
      }
      if (receiver?.id === accountId) {
          removeDefaultReceiver();
          setReceiver(null);
      }
      invalidateCacheByPrefix("ACCOUNT_LIST_");
      refetch();
  }


  useAccountSSE(handleAccountSSERefetch);

  return (
    <div className="mx-auto px-2 md:px-6 max-w-6xl w-full py-4 md:py-20">
      <div className="flex gap-12 items-start">

        {/* Sidebar — desktop only */}
        <div className="hidden lg:flex flex-col gap-3 w-xs shrink-0 sticky top-10">
          <DefaultAccountCard
            label="Sender"
            account={sender}
            onRemove={() => {
              removeDefaultSender();
              setSender(null);
            }}
          />
          <DefaultAccountCard
            label="Receiver"
            account={receiver}
            onRemove={() => {
              removeDefaultReceiver();
              setReceiver(null);
            }}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-6">

          {/* Mobile summary */}
          <div className="flex gap-3 lg:hidden">
          <DefaultAccountCard
            label="Sender"
            account={sender}
            onRemove={() => {
              removeDefaultSender();
              setSender(null);
            }}
          />
          <DefaultAccountCard
            label="Receiver"
            account={receiver}
            onRemove={() => {
              removeDefaultReceiver();
              setReceiver(null);
            }}
          />
          </div>

          <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="font-mono text-lg text-foreground text-center md:text-start">Bank Accounts</h1>
              <p className="text-xs text-text-muted mt-1 text-center md:text-start">
                Manage default sender and receiver accounts. Click an account to verify with PIN.
              </p>
            </div>
            <Link
              to={NAVIGATION_ROUTES.CREATE_ACCOUNT}
              className="shrink-0 mx-auto md:mx-0"
            >
              <Button size="sm" variant="secondary">Create New Account</Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Input
              leftIcon={<SearchIcon size={14} className="text-text-muted pointer-events-none mb-1" />}
              id="account-search"
              type="text"
              placeholder="Search by name or account number..."
              value={search}
              onChange={handleSearchChange}
              className="pl-8 bg-surface"
            />
            <InputProgressBar active={isLoading && !!accountList} />
          </div>

          {/* List */}
          {isLoading && !accountList ? (
            <EllipsisLoader value="Loading accounts" />
          ) : error ? (
            <p className="text-sm text-red-400 font-mono">Failed to load accounts.</p>
          ) : accountList?.items.length === 0 ? (
            <p className="text-sm text-text-muted font-mono">No accounts found.</p>
          ) : (
            <div className="space-y-2 xl:min-h-75">
              {accountList?.items.map((account) => (
                <AccountCard
                  key={account.account_number}
                  account={account}
                  onSetSender={setSender}
                  onSetReceiver={setReceiver}
                  onDelete={refetch}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
