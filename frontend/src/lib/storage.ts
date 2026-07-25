import type { AccountResponse } from "@/features/accounts/types/account";

const UNLOCKED_KEY = "unlocked_accounts";
const DEFAULT_SENDER_KEY = "default_sender";
const DEFAULT_RECEIVER_KEY = "default_receiver";

/**
 * Reads the set of unlocked account numbers from sessionStorage.
 *
 * An account is "unlocked" once its correct PIN has been entered during
 * this browser session, letting the user view its details/balance without
 * re-entering the PIN every time.
 *
 * @returns Set of unlocked account numbers, or an empty Set if none are
 * stored yet or the stored value can't be parsed.
 */
export function getUnlockedAccounts(): Set<number> {
	try {
		const raw = sessionStorage.getItem(UNLOCKED_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

/**
 * Marks an account as unlocked for the current session by adding it to the
 * unlocked set and persisting the updated set back to sessionStorage.
 *
 * @param accountNumber - The account's number (not its ID) to unlock.
 */
export function markAccountUnlocked(accountNumber: number): void {
	const current = getUnlockedAccounts();
	current.add(accountNumber);
	sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify([...current]));
}

/**
 * Removes an account from the unlocked set (e.g. on delete/expiry), clearing
 * the sessionStorage key entirely if no unlocked accounts remain.
 *
 * @param accountNumber - The account's number (not its ID) to lock again.
 */
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

/**
 * Gets the account saved as the default sender, if one was previously set.
 *
 * @returns The saved default sender account, or null if none is set.
 */
export function getDefaultSender(): AccountResponse | null {
	try {
		const raw = localStorage.getItem(DEFAULT_SENDER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

/**
 * Gets the account saved as the default receiver, if one was previously set.
 *
 * @returns The saved default receiver account, or null if none is set.
 */
export function getDefaultReceiver(): AccountResponse | null {
	try {
		const raw = localStorage.getItem(DEFAULT_RECEIVER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

/**
 * Saves the given account as the default sender in localStorage.
 *
 * @param account - The account to save, or null to clear the value.
 */
export function setDefaultSender(account: AccountResponse | null): void {
	localStorage.setItem(DEFAULT_SENDER_KEY, JSON.stringify(account));
}

/**
 * Saves the given account as the default receiver in localStorage.
 *
 * @param account - The account to save, or null to clear the value.
 */
export function setDefaultReceiver(account: AccountResponse | null): void {
	localStorage.setItem(DEFAULT_RECEIVER_KEY, JSON.stringify(account));
}

/**
 * Removes the saved default sender from localStorage.
 */
export function removeDefaultSender(): void {
	localStorage.removeItem(DEFAULT_SENDER_KEY);
}

/**
 * Removes the saved default receiver from localStorage.
 */
export function removeDefaultReceiver(): void {
	localStorage.removeItem(DEFAULT_RECEIVER_KEY);
}
