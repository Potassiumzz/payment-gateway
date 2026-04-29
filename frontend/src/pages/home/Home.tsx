import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<>
			<Link to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE}>Simulate Merchant</Link>
		</>
	);
}
