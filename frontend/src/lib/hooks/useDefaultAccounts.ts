import React from "react";
import {
	getDefaultSender,
	getDefaultReceiver,
	setDefaultSender,
	setDefaultReceiver,
	removeDefaultSender,
	removeDefaultReceiver,
} from "@/lib/storage";
import type { AccountResponse } from "@/features/accounts/types/account";

export function useDefaultAccounts() {
	const [sender, setSenderState] = React.useState<AccountResponse | null>(() => getDefaultSender());
	const [receiver, setReceiverState] = React.useState<AccountResponse | null>(() => getDefaultReceiver());

	function setSender(account: AccountResponse | null) {
		setDefaultSender(account);
		setSenderState(account);
	}

	function setReceiver(account: AccountResponse | null) {
		setDefaultReceiver(account);
		setReceiverState(account);
	}

	function removeSenderAndReceiver(accountNumber: number) {
		if (sender?.accountNumber === accountNumber) {
			removeDefaultSender();
			setSender(null);
		}
		if (receiver?.accountNumber === accountNumber) {
			removeDefaultReceiver();
			setReceiver(null);
		}
	}

	return { sender, receiver, setSender, setReceiver, removeSenderAndReceiver };
}
