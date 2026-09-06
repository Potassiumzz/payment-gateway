import { cn } from "@/lib/utils";
import { NAV_LINKS } from "../data";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
}
export function MobileMenu({open, setOpen, pathname}: MobileMenuProps) {
  return(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-[72px] z-30 md:hidden",
          "backdrop-blur-md bg-background/40",
          "transition-opacity duration-300 ease-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      <div
        style={{
          transition: "clip-path 200ms ease-out, opacity 200ms ease-out",
          clipPath: open
            ? "inset(0% 0% 0% 0%)"
            : "inset(0% 0% 100% 100%)",
        }}
        className={cn(
          "fixed inset-x-0 top-[72px] bg-background z-30 md:hidden overflow-hidden",
          "w-full min-h-45 drop-shadow-lg",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {NAV_LINKS.map((nav) => {
          const isActive = pathname === nav.href;
          return (
            <Link
              key={nav.href}
              to={nav.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-8 py-4 text-sm tracking-wide transition-colors duration-150",
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
              viewTransition
            >
              {nav.label}
            </Link>
          );
        })}
      </div>
    </>
  )
}
