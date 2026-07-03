import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

const linkClass = "inline-flex items-center gap-2 border border-border hover:border-border-strong text-text-secondary hover:text-text-primary text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors duration-150";

type ResultActionsProps = {
  isSuccess: boolean;
  id?: string;
  returnUrl?: string;
};

export function ResultActions({ isSuccess, id, returnUrl }: ResultActionsProps) {
  if (isSuccess) {
    return (
      <div className="flex gap-4 justify-center">
        {returnUrl && (
          <a href={returnUrl} className={linkClass}>
            Return to merchant
          </a>
        )}
        <Link to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE} className={linkClass} viewTransition>
          New simulation
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center">
      <Link to={`${NAVIGATION_ROUTES.CHECKOUT_ROUTE}/${id}`} className={linkClass} viewTransition>
        Re-try payment
      </Link>
      <Link to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE} className={linkClass} viewTransition>
        New simulation
      </Link>
    </div>
  );
}
