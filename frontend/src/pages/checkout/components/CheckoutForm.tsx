import type { PaymentIntentResponse } from "@/features/payments/types/paymentIntent";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import type { CreateTransactionPayload } from "@/features/transactions/types/transaction";
import React from "react";
import { checkoutFormFields } from "@/pages/checkout/data/formFields";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { FieldError } from "@/components/ui/FieldError";
import { Button } from "@/components/ui/Button";
import { useDefaultAccounts } from "@/lib/hooks";
import { updateEachCacheEntry } from "@/cache/queryCache";
import type { AccountResponse } from "@/features/accounts/types/account";
import { QUERY_KEY_PREFIX } from "@/cache/queryKeys";

type CheckoutFormProps = {
	intentDetail: PaymentIntentResponse;
};

export default function CheckoutForm({ intentDetail }: CheckoutFormProps) {
  const navigate = useNavigate();

  const { sender, receiver, setSender, setReceiver } = useDefaultAccounts();

  const isFieldDisabled = (name: string) => {
    if (name === "sender_account_number") return Boolean(sender);
    if (name === "receiver_account_number") return Boolean(receiver) || Boolean(intentDetail.receiver_account_number);
    return false;
  };

	const [values, setValues] = React.useState({
		payment_intent_id: intentDetail.id,
		sender_account_number: sender?.account_number ?? 0,
    receiver_account_number: intentDetail.receiver_account_number ?? receiver?.account_number ?? 0,
		security_pin: "",
	} satisfies CreateTransactionPayload);

	const { createTransaction, error, isLoading } = useCreateTransaction();

  function handleDefaultCardBalanceUpdate(amount: number): void {
    if (sender) {
      const senderBalance = sender?.balance - amount;
      const updatedSender = {...sender, balance: senderBalance};
      setSender(updatedSender);
    };

    if(receiver) {
      const receiverBalance = receiver?.balance + amount;
      const updatedReceiver = {...receiver, balance: receiverBalance};
      setReceiver(updatedReceiver);
    }
  }

  function handleAccountListCacheUpdate(amount: number): void {
    updateEachCacheEntry<{ items: AccountResponse[] }>(
      QUERY_KEY_PREFIX.ACCOUNT_LIST,
      (cache) => ({
        ...cache,
        items: cache.items.map((acc) => {
          if (acc.account_number === sender?.account_number) {
            return { ...acc, balance: acc.balance - amount };
          }
          if (acc.account_number === receiver?.account_number) {
            return { ...acc, balance: acc.balance + amount };
          }
          return acc;
        }),
      })
    );
  }

	async function handlePaySubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
      const res = await createTransaction(values);
      const amount = parseFloat(res.amount_transferred);

      handleDefaultCardBalanceUpdate(amount);
      handleAccountListCacheUpdate(amount);

      if (!isLoading) navigate(`${NAVIGATION_ROUTES.PAYMENT_RESULT_ROUTE}${res.id}`);
    } catch(err) {
      console.log(err);
    }
	}

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <Card>
      <CardHeader
        title="Payment Details"
        description="Enter your account credentials to complete the transaction"
        badge={
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="hidden md:block font-sans text-[2px] text-text-muted uppercase tracking-widest">
              sandbox
            </span>
          </div>
        }
      />
      <CardContent>
        <form onSubmit={handlePaySubmit} className="space-y-5">
          {checkoutFormFields.map((field) => {
            const value = values[field.name as keyof typeof values];
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.inputType}
                  placeholder={field.placeholder}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  disabled={isLoading || isFieldDisabled(field.name)}
                  value={value === 0 ? "" : value}
                  onChange={handleChange}
                />
              </div>
            )})}
          <FieldError message={error} />
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing payment..." : `Pay $${parseFloat(intentDetail.amount).toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
