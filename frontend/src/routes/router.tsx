import NotFoundPage from "@/components/page/NotFoundPage";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { RootLayout } from "@/layouts/RootLayout";
import { AccountListPage } from "@/pages/account/AccountListPage";
import CreateAccountPage from "@/pages/account/CreateAccountPage";
import CheckoutPage from "@/pages/checkout/Checkout";
import Home from "@/pages/home/Home";
import PaymentResultPage from "@/pages/payment-result/PaymentResult";
import SimulateMerchantPage from "@/pages/simulate-merchant/SimulateMerchant";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{ path: "/", element: <Home /> },
			{ path: NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE, element: <SimulateMerchantPage /> },
			{ path: `${NAVIGATION_ROUTES.CHECKOUT_ROUTE}:id`, element: <CheckoutPage /> },
			{ path: `${NAVIGATION_ROUTES.PAYMENT_RESULT_ROUTE}:id`, element: <PaymentResultPage /> },
			{ path: NAVIGATION_ROUTES.CREATE_ACCOUNT, element: <CreateAccountPage /> },
			{ path: NAVIGATION_ROUTES.ACCOUNTS, element: <AccountListPage /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
]);
