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

	function setSender(account: AccountResponse | null) {
		setDefaultSender(account);
		setSenderState(account);
	}

	function setReceiver(account: AccountResponse | null) {
		setDefaultReceiver(account);
		setReceiverState(account);
	}

	function removeSenderAndReceiver(accountId: number) {
		if (sender?.id === accountId) {
			removeDefaultSender();
			setSender(null);
		}
		if (receiver?.id === accountId) {
			removeDefaultReceiver();
			setReceiver(null);
		}
	}

	return { sender, receiver, setSender, setReceiver, removeSenderAndReceiver };
}

/**
 * Drives a fake, non-deterministic progress value (0-100) purely for visual
 * feedback during background refetches. There's no real progress signal from
 * the backend, so this fakes the classic "ramp up, stall, snap to 100" feel.
 */
export function useFakeProgress(isActive: boolean) {
	const [progress, setProgress] = React.useState(0);
	const [visible, setVisible] = React.useState(false);
	const [fading, setFading] = React.useState(false);
	const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

	function clearTimers() {
		timeoutsRef.current.forEach(clearTimeout);
		timeoutsRef.current = [];
	}

	React.useEffect(() => {
		if (isActive) {
			clearTimers();
			setVisible(true);
			setFading(false);
			setProgress(0);

			// randomized ramp: a couple of steps climbing toward a random ceiling
			// (e.g. sometimes stalls at 45%, sometimes at 68%, etc.)
			const ceiling = 40 + Math.random() * 30; // 40–70
			const firstJump = ceiling * (0.5 + Math.random() * 0.3); // 50–80% of ceiling

			timeoutsRef.current.push(
				setTimeout(() => setProgress(firstJump), 50),
				setTimeout(() => setProgress(ceiling), 350 + Math.random() * 200),
			);
		} else {
			clearTimers();
			// only animate the completion sequence if a load was actually in progress
			setProgress((prev) => {
				if (prev === 0) return prev;

				timeoutsRef.current.push(
					setTimeout(() => setProgress(100), 20),
					setTimeout(() => setFading(true), 250),
					setTimeout(() => {
						setVisible(false);
						setFading(false);
						setProgress(0);
					}, 500),
				);

				return prev;
			});
		}

		return clearTimers;
	}, [isActive]);

	return { progress, visible, fading };
}
