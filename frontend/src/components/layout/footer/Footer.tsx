import { EXTERNAL_LINKS } from "@/constants/routes"
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { FOOTER_LINKS } from "./data";

export function Footer() {
  const { pathname } = useLocation();

  return (
    <footer className="py-4 px-8 mt-auto">
      <div className="flex items-center justify-between gap-6">
        <a
          href={EXTERNAL_LINKS.SOURCE_CODE}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wide text-zinc-600 hover:text-zinc-300 transition-colors duration-150"
        >
          source code
        </a>
        <div className="flex items-center">
          {FOOTER_LINKS.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <Link
                key={nav.href}
                to={nav.href}
                className={cn(
                  "text-sm tracking-wide transition-colors duration-150",
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                )}
                viewTransition
              >
                {nav.label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
