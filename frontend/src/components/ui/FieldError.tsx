import { cn } from "@/lib/utils";

type FieldErrorProps = {
  message?: string | null;
  className?: string;
};

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "font-mono text-xs text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2 rounded-sm",
        className
      )}
    >
      {message}
    </p>
  );
}
