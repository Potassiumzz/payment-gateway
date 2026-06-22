const UNLOCKED_KEY = "unlocked_accounts";

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
