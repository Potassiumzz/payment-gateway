import type { PaymentIntentResponse } from "@/features/payments/types/paymentIntent";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import type { CreateTransactionPayload } from "@/features/transactions/types/transaction";
import React from "react";

type CheckoutFormProps = {
	intentDetail: PaymentIntentResponse;
};
export default function CheckoutForm({ intentDetail }: CheckoutFormProps) {
	const checkoutFormFields = [
		{
			id: "1",
			label: "Account Number",
			inputType: "number",
			placeholder: "Your account number",
			name: "sender_account_number",
		},
		{
			id: "2",
			label: "Receiver Account Number",
			inputType: "number",
			placeholder: "Receiver's account number",
			name: "receiver_account_number",
		},
		// {
		//   id: "3",
		//   label: "Email",
		//   inputType: "email",
		//   placeholder: "email@example.com"
		// },
		{
			id: "4",
			label: "Security pin",
			inputType: "password",
			placeholder: "Your security pin",
			name: "security_pin",
		},
	];

	const [values, setValues] = React.useState({
		payment_intent_id: "",
		sender_account_number: 0,
		receiver_account_number: 0,
		security_pin: "",
	} satisfies CreateTransactionPayload);

	const { createTransaction, isLoading, error } = useCreateTransaction();

	function handlePaySubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		createTransaction(values);
		console.log("paid");
	}

	React.useEffect(() => {
		setValues({ ...values, payment_intent_id: intentDetail.id });
	}, []);

	return (
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
						/>
					</div>
				);
			})}
			<button type="submit">Pay {intentDetail.amount}</button>
		</form>
	);
}
