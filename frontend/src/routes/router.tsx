import { CHECKOUT_ROUTE, SIMULATE_MERCHANT_ROUTE } from "@/constants/routes";
import CheckoutPage from "@/pages/checkout/Checkout";
import Home from "@/pages/home/Home";
import SimulateMerchantPage from "@/pages/simulate-merchant/SimulateMerchant";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: SIMULATE_MERCHANT_ROUTE,
    element: <SimulateMerchantPage/>
  },
  {
    path: `${CHECKOUT_ROUTE}:id`,
    element: <CheckoutPage/>
  }
])
