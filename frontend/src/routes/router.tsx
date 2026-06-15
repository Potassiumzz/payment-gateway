import { NAVIGATION_ROUTES } from "@/constants/routes";
import CheckoutPage from "@/pages/checkout/Checkout";
import Home from "@/pages/home/Home";
import PaymentResultPage from "@/pages/payment-result/PaymentResult";
import SimulateMerchantPage from "@/pages/simulate-merchant/SimulateMerchant";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE,
		element: <SimulateMerchantPage />,
	},
	{
		path: `${NAVIGATION_ROUTES.CHECKOUT_ROUTE}:id`,
		element: <CheckoutPage />,
	},
	{
		path: `${NAVIGATION_ROUTES.PAYMENT_RESULT_ROUTE}:id`,
		element: <PaymentResultPage />,
	},
]);
