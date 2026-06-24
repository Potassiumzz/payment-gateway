import { NAVIGATION_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom"

const NAV_LINKS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Simulate Merchant",
    href: NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE,
  },
  {
    label: "Bank Accounts",
    href: NAVIGATION_ROUTES.ACCOUNTS,
  }
]

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="relative flex items-center px-8 py-5">
      <span className="font-mono text-sm tracking-widest text-zinc-500 uppercase cursor-default select-none">
        ntay
      </span>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
        {NAV_LINKS.map((nav) => {
          const isActive = pathname === nav.href;
          return (
            <Link
              key={nav.href}
              to={nav.href}
              className={cn(
                "font-mono text-sm tracking-wide transition-colors duration-150",
                isActive
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              {nav.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
