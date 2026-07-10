import type { Field } from "../components/FieldTable";

export const REQUEST_FIELDS: Field[] = [
	{
		name: "amount",
		type: "number",
		required: true,
		description: "Amount to charge in USD (e.g. 29.99). This sandbox only supports USD.",
	},
	{
		name: "return_url",
		type: "string",
		required: false,
		description: "URL to redirect the user to after a successful payment.",
	},
	{
		name: "receiver_account_number",
		type: "number",
		required: false,
		description:
			"Pre-fill a specific receiver account. Defaults to a selectable list at checkout if omitted.",
	},
];

export const RESPONSE_FIELDS: Field[] = [
	{ name: "id", type: "string", required: true, description: "Unique identifier for the payment intent." },
	{
		name: "amount",
		type: "string",
		required: true,
		description: "The amount echoed back as a formatted string.",
	},
	{
		name: "status",
		type: "string",
		required: true,
		description: "Status of the intent: Pending, Succeeded, RequiresPayment, Failed.",
	},
	{
		name: "checkout_url",
		type: "string",
		required: true,
		description:
			"The checkout URL where the application is supposed to re-direct to complete the transaction.",
	},
	{
		name: "return_url",
		type: "string",
		required: false,
		description: "The return URL provided at creation, if any.",
	},
	{
		name: "receiver_account_number",
		type: "number",
		required: false,
		description: "The receiver account number, if provided at creation.",
	},
];
