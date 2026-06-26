import type { AccountResponse } from "@/features/accounts/types/account";

const UNLOCKED_KEY = "unlocked_accounts";
const DEFAULT_SENDER_KEY = "default_sender";
const DEFAULT_RECEIVER_KEY = "default_receiver";

export function getUnlockedAccounts(): Set<number> {
	try {
		const raw = sessionStorage.getItem(UNLOCKED_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

export function markAccountUnlocked(accountNumber: number): void {
	const current = getUnlockedAccounts();
	current.add(accountNumber);
	sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify([...current]));
}

export function removeUnlockedAccount(accountNumber: number): void {
	try {
		const current = getUnlockedAccounts();
		current.delete(accountNumber);

		if (current.size === 0) {
			sessionStorage.removeItem(UNLOCKED_KEY);
		} else {
			sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify([...current]));
		}
	} catch {
		// Ignore storage errors
	}
}

export function getDefaultSender(): AccountResponse | null {
	try {
		const raw = localStorage.getItem(DEFAULT_SENDER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function getDefaultReceiver(): AccountResponse | null {
	try {
		const raw = localStorage.getItem(DEFAULT_RECEIVER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function setDefaultSender(account: AccountResponse | null): void {
	localStorage.setItem(DEFAULT_SENDER_KEY, JSON.stringify(account));
}

export function setDefaultReceiver(account: AccountResponse | null): void {
	localStorage.setItem(DEFAULT_RECEIVER_KEY, JSON.stringify(account));
}

export function removeDefaultSender(): void {
	localStorage.removeItem(DEFAULT_SENDER_KEY);
}

export function removeDefaultReceiver(): void {
	localStorage.removeItem(DEFAULT_RECEIVER_KEY);
}
