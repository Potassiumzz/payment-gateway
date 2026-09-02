import type { AccountResponse } from "@/features/accounts/types/account";
import {
	getDefaultReceiver,
	getDefaultSender,
	getUnlockedAccounts,
	markAccountUnlocked,
	removeDefaultReceiver,
	removeDefaultSender,
	removeUnlockedAccount,
	setDefaultReceiver,
	setDefaultSender,
} from "@/lib/storage";
import { describe, expect, it } from "vitest";

describe("Unlocked accounts", () => {
	describe("getUnlockedAccounts", () => {
		it("returns an empty Set when nothing is stored", () => {
			expect(getUnlockedAccounts().size).toEqual(0);
			expect(getUnlockedAccounts()).toEqual(new Set()); // empty set
		});

		it("returns parsed set when valid JSON is stored", () => {
			sessionStorage.setItem("unlocked_accounts", JSON.stringify([123, 456]));
			expect(getUnlockedAccounts()).toEqual(new Set([123, 456]));
		});

		it("returns an empty Set when the stored value is an invalid JSON", () => {
			sessionStorage.setItem("unlocked_accounts", "123");
			expect(getUnlockedAccounts()).toEqual(new Set());
		});
	});

	describe("markAccountUnlocked", () => {
		it("stores an unlocked account's number in the sessionStorage with key 'unlocked_accounts'", () => {
			markAccountUnlocked(1122);

			expect(getUnlockedAccounts()).toEqual(new Set([1122]));
			expect(sessionStorage.key(0)).toEqual("unlocked_accounts");
		});

		it("stores multiple unlocked accounts' number in the sessionStorage", () => {
			markAccountUnlocked(123);
			markAccountUnlocked(456);
			markAccountUnlocked(789);

			expect(getUnlockedAccounts()).toEqual(new Set([123, 456, 789]));
			expect(sessionStorage.key(0)).toEqual("unlocked_accounts");
		});
	});

	describe("removeAccountUnlocked", () => {
		it("removes an account from the set based on account's number", () => {
			sessionStorage.setItem("unlocked_accounts", JSON.stringify([123, 456]));
			expect(getUnlockedAccounts()).toEqual(new Set([123, 456]));

			removeUnlockedAccount(123);
			expect(getUnlockedAccounts()).toEqual(new Set([456]));
		});

		it("clears the storage key entirely when set becomes empty", () => {
			sessionStorage.setItem("unlocked_accounts", JSON.stringify([123]));
			expect(getUnlockedAccounts()).toEqual(new Set([123]));

			removeUnlockedAccount(123);
			expect(sessionStorage.getItem("unlocked_accounts")).toBeNull(); // sessionStorage returns null when there is no key
		});
	});
});

describe("Default accounts", () => {
	describe.each([
		{
			label: "sender",
			key: "default_sender",
			get: getDefaultSender,
			set: setDefaultSender,
			remove: removeDefaultSender,
		},
		{
			label: "receiver",
			key: "default_receiver",
			get: getDefaultReceiver,
			set: setDefaultReceiver,
			remove: removeDefaultReceiver,
		},
	])("default $label", ({ key, get, set, remove }) => {
		const data = {
			accountNumber: 123,
			ownerName: "Some name",
			balance: 300,
			isActive: true,
			isDefault: false,
			expiresAt: "2099-12-12",
			bank: { id: 1, name: "Bank" },
		} satisfies AccountResponse;

		it("returns null when nothing is stored", () => {
			expect(get()).toBeNull();
		});

		it("stores and retrieves under the correct key", () => {
			set(data);
			expect(localStorage.getItem(key)).toEqual(JSON.stringify(data));
			expect(get()).toEqual(data);
		});

		it("overwrite replaces the previous value", () => {
			set({ ...data, accountNumber: 999 });
			set(data);
			expect(get()).toEqual(data);
		});

		it("remove clears the key", () => {
			set(data);
			remove();
			expect(localStorage.getItem(key)).toBeNull();
		});
	});

	it("sender and receiver are stored independently", () => {
		const senderData = {
			accountNumber: 123,
			ownerName: "Sender owner",
			balance: 300,
			isActive: true,
			isDefault: false,
			expiresAt: "2099-12-12",
			bank: { id: 1, name: "Bank" },
		} satisfies AccountResponse;

		const receiverData = {
			accountNumber: 123,
			ownerName: "Sender owner",
			balance: 300,
			isActive: true,
			isDefault: false,
			expiresAt: "2099-12-12",
			bank: { id: 1, name: "Bank" },
		} satisfies AccountResponse;

		setDefaultSender(senderData);
		expect(getDefaultReceiver()).toBeNull();

		setDefaultReceiver(receiverData);

		expect(getDefaultSender()).toEqual(senderData);
		expect(getDefaultReceiver()).toEqual(receiverData);
	});
});
