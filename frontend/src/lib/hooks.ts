import React from "react";
import { getDefaultSender, getDefaultReceiver, setDefaultSender, setDefaultReceiver } from "@/lib/storage";
import type { AccountResponse } from "@/features/accounts/types/account";

export function useDebounce<T>(value: T, delay = 400): T {
	const [debounced, setDebounced] = React.useState(value);

	React.useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debounced;
}

export function useDefaultAccounts() {
	const [sender, setSenderState] = React.useState<AccountResponse | null>(() => getDefaultSender());
	const [receiver, setReceiverState] = React.useState<AccountResponse | null>(() => getDefaultReceiver());

	function setSender(account: AccountResponse) {
		setDefaultSender(account);
		setSenderState(account);
	}

	function setReceiver(account: AccountResponse) {
		setDefaultReceiver(account);
		setReceiverState(account);
	}

	return { sender, receiver, setSender, setReceiver };
}
