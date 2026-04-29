import type { PaymentIntentResponse } from "@/features/payments/types/paymentIntent";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import type { CreateTransactionPayload } from "@/features/transactions/types/transaction";
import React from "react";
import { checkoutFormFields } from "@/pages/checkout/data/formFields";

type CheckoutFormProps = {
	intentDetail: PaymentIntentResponse;
};

export default function CheckoutForm({ intentDetail }: CheckoutFormProps) {
	const [values, setValues] = React.useState({
		payment_intent_id: "",
		sender_account_number: 0,
		receiver_account_number: 0,
		security_pin: "",
	} satisfies CreateTransactionPayload);

	const { createTransaction, error, isLoading } = useCreateTransaction();

	function handlePaySubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		createTransaction(values);
		console.log("paid");
	}

	React.useEffect(() => {
		setValues({ ...values, payment_intent_id: intentDetail.id });
	}, []);

	return (
    <div className="space-y-2">
      <form onSubmit={handlePaySubmit}>
        {checkoutFormFields.map((field) => {
          return (
            <div key={field.id}>
              <label>{field.label}</label>
              <input
                type={field.inputType}
                placeholder={field.placeholder}
                name={field.name}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                disabled={isLoading}
              />
            </div>
          );
        })}
        <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : `Pay ${intentDetail.amount}`}</button>
      </form>
      <div>
        <div>{error}</div>
      </div>
    </div>
	);
}
