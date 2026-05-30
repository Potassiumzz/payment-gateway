import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "bg-primary hover:bg-primary-hover text-white",
  secondary: "bg-transparent border border-border hover:border-border-strong text-text-secondary hover:text-text-primary",
  ghost:     "bg-transparent hover:bg-surface text-text-muted hover:text-text-secondary",
  danger:    "bg-transparent border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  isLoading,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-mono font-semibold rounded-sm",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {isLoading ? (
        <>
          <span className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
