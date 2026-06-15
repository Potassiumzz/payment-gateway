import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

const linkClass = "inline-flex items-center gap-2 border border-border hover:border-border-strong text-text-secondary hover:text-text-primary font-mono text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors duration-150";

type ResultActionsProps = {
  isSuccess: boolean;
  id?: string;
};

export function ResultActions({ isSuccess, id }: ResultActionsProps) {
  if (isSuccess) {
    return (
      <Link to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE} className={linkClass}>
        New simulation
      </Link>
    );
  }

  return (
    <div className="flex gap-4 justify-center">
      <Link to={`${NAVIGATION_ROUTES.CHECKOUT_ROUTE}/${id}`} className={linkClass}>
        Re-try payment
      </Link>
      <Link to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE} className={linkClass}>
        New simulation
      </Link>
    </div>
  );
}
