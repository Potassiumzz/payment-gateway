import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom"
import { NAV_LINKS } from "./data";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const hidden = useScrollDirection();

  return (
    <nav
      className={cn(
        "relative z-40 sticky top-0 backdrop-blur-lg bg-background/40 transition-transform duration-300",
        hidden && "-translate-y-full",
      )}
    >
      <div className="flex items-center justify-between px-8 py-5">
        <span className="font-mono text-sm tracking-widest text-zinc-500 uppercase cursor-default select-none">
          ntay
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <Link
                key={nav.href}
                to={nav.href}
                className={cn(
                  "text-sm tracking-wide transition-colors duration-150",
                  isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                )}
                viewTransition
              >
                {nav.label}
              </Link>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Toggle menu"
        >
          <MenuIcon
            size={18}
            className={cn("absolute transition-all duration-200", open ? "opacity-0 rotate-90" : "opacity-100 rotate-0")}
          />
          <XIcon
            size={18}
            className={cn("transition-all duration-200", open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90")}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-[72px] z-10 md:hidden backdrop-blur-sm bg-black/40 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "absolute bg-background w-full min-h-50 border-b border-white/40 z-20 md:hidden transition-all duration-200 overflow-hidden",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
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
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
              )}
              viewTransition
            >
              {nav.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
