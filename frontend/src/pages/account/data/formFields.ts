type FormField =
	| {
			type: "input";
			label: string;
			inputType: string;
			placeholder: string;
			name: string;
			autoComplete?: string;
	  }
	| {
			type: "select";
			label: string;
			placeholder: string;
			name: string;
	  };

export const createAccountFormFields: FormField[] = [
	{
		type: "input",
		label: "Owner name",
		inputType: "text",
		placeholder: "Enter a fake name",
		name: "ownerName",
	},
	{
		type: "select",
		label: "Bank",
		placeholder: "Select a bank",
		name: "bankId",
	},
	{
		type: "input",
		label: "PIN",
		inputType: "password",
		placeholder: "Your security pin",
		name: "pin",
		autoComplete: "current-password",
	},
];
