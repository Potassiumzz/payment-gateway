export const checkoutFormFields = [
	{
		label: "Sender Account Number",
		inputType: "number",
		placeholder: "Your account number",
		name: "sender_account_number",
	},
	{
		label: "Receiver Account Number",
		inputType: "number",
		placeholder: "Receiver's account number",
		name: "receiver_account_number",
	},
	// {
	//   label: "Email",
	//   inputType: "email",
	//   placeholder: "email@example.com"
	// },
	{
		label: "Security pin",
		inputType: "password",
		placeholder: "Your security pin",
		name: "security_pin",
		autoComplete: "current-password",
	},
];
