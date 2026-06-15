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

type CheckoutFormProps = {
	intentDetail: PaymentIntentResponse;
};

export default function CheckoutForm({ intentDetail }: CheckoutFormProps) {
  const navigate = useNavigate();

	const [values, setValues] = React.useState({
		payment_intent_id: intentDetail.id,
		sender_account_number: 0,
		receiver_account_number: 0,
		security_pin: "",
	} satisfies CreateTransactionPayload);

	const { createTransaction, error, isLoading } = useCreateTransaction();

	async function handlePaySubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
      const res = await createTransaction(values);
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
            <span className="font-sans text-[2px] text-text-muted uppercase tracking-widest">
              sandbox
            </span>
          </div>
        }
      />
      <CardContent>
        <form onSubmit={handlePaySubmit} className="space-y-5">
          {checkoutFormFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.inputType}
                placeholder={field.placeholder}
                name={field.name}
                disabled={isLoading}
                onChange={handleChange}
              />
            </div>
          ))}
          <FieldError message={error} />
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Pay ${parseFloat(intentDetail.amount).toFixed(2)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
