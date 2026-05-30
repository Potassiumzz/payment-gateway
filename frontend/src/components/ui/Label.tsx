import { cn } from "@/lib/utils";

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;       // subtle right-side hint text
  required?: boolean;
  className?: string;
  hintClassName?: string;
};

export function Label({ htmlFor, children, hint, required, className, hintClassName }: LabelProps) {
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className={cn(
          "font-mono text-xs text-text-secondary uppercase tracking-widest",
          className
        )}
      >
        {children}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {hint && (
        <span className={cn("font-mono text-[11px] text-text-muted", hintClassName)}>{hint}</span>
      )}
    </div>
  );
}
