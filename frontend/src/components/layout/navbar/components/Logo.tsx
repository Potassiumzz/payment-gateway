import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { Link } from "react-router-dom";

export function Logo() {
  const isMobile = useMediaQuery({
    type: "max-width",
    value: BREAKPOINTS.md - 1,
  });

  const className =
    "font-mono text-sm tracking-widest text-zinc-500 uppercase select-none";

  if (isMobile) {
    return (
      <Link
        to="/"
        className={`${className} cursor-pointer`}
        viewTransition
      >
        ntay
      </Link>
    );
  }

  return (
    <span className={`${className} cursor-default`}>
      ntay
    </span>
  );
}
