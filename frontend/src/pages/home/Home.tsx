import { SIMULATE_MERCHANT_ROUTE } from "@/constants/routes";
import {Link} from "react-router-dom";

export default function Home() {
  return (
    <>
      <Link to={SIMULATE_MERCHANT_ROUTE}>Simulate Merchant</Link>
    </>
  );
}
