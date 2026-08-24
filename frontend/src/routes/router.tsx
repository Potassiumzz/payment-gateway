import NotFoundPage from "@/components/page/NotFoundPage";
import { NAVIGATION_ROUTES, type RouteHandle } from "@/constants/routes";
import { CheckoutLayout } from "@/layouts/CheckoutLayout";
import { RootLayout } from "@/layouts/RootLayout";
import { AccountListPage } from "@/pages/account/AccountListPage";
import CreateAccountPage from "@/pages/account/CreateAccountPage";
import CheckoutPage from "@/pages/checkout/Checkout";
import DocumentationPage from "@/pages/documentation/DocumentationPage";
import Home from "@/pages/home/Home";
import PaymentResultPage from "@/pages/payment-result/PaymentResult";
import SimulateMerchantPage from "@/pages/simulate-merchant/SimulateMerchant";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{ path: "/", element: <Home /> },
			{
				path: NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE,
				element: <SimulateMerchantPage />,
				handle: { title: "Simulate Merchant" } satisfies RouteHandle,
			},
			{
				path: NAVIGATION_ROUTES.CREATE_ACCOUNT,
				element: <CreateAccountPage />,
				handle: { title: "Create Account" } satisfies RouteHandle,
			},
			{
				path: NAVIGATION_ROUTES.ACCOUNTS,
				element: <AccountListPage />,
				handle: { title: "Bank Accounts" } satisfies RouteHandle,
			},
			{
				path: NAVIGATION_ROUTES.DOCUMENTATION,
				element: <DocumentationPage />,
				handle: { title: "Docs" } satisfies RouteHandle,
			},
			{ path: "*", element: <NotFoundPage />, handle: { title: "404" } satisfies RouteHandle },
		],
	},
	{
		element: <CheckoutLayout />,
		children: [
			{ path: `${NAVIGATION_ROUTES.CHECKOUT_ROUTE}:id`, element: <CheckoutPage /> },
			{ path: `${NAVIGATION_ROUTES.PAYMENT_RESULT_ROUTE}:intentId`, element: <PaymentResultPage /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
]);
