import type { CreateTransactionPayload } from "@/features/transactions/types/transaction";
import React from "react";

type CheckoutField = Pick<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "placeholder" | "autoComplete" | "maxLength" | "pattern" | "inputMode"
> & {
	label: string;
	name: keyof CreateTransactionPayload;
};

export const checkoutFormFields: CheckoutField[] = [
	{
		label: "Sender Account Number",
		type: "number",
		placeholder: "Your account number",
		name: "senderAccountNumber",
	},
	{
		label: "Receiver Account Number",
		type: "number",
		placeholder: "Receiver's account number",
		name: "receiverAccountNumber",
	},
	{
		label: "Security pin",
		type: "password",
		placeholder: "Your security pin",
		name: "securityPin",
	},
];
