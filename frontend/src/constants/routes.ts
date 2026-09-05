export const NAVIGATION_ROUTES = {
	CHECKOUT_ROUTE: "/checkout/",
	SIMULATE_MERCHANT_ROUTE: "/simulate-merchant/",
	PAYMENT_RESULT_ROUTE: "/payment-result/",
	CREATE_ACCOUNT: "/create-account/",
	ACCOUNTS: "/accounts/",
	DOCUMENTATION: "/docs/",
};

export const EXTERNAL_LINKS = {
	SOURCE_CODE: "https://github.com/eightballk/payment-gateway",
} as const;

export interface RouteHandle {
	title?: string;
}
