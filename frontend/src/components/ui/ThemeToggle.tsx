import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="relative w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors duration-150"
    >
      <SunIcon
        size={18}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
      />
      <MoonIcon
        size={18}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        )}
      />
    </button>
  );
}
