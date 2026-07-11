import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  options,
  placeholder,
  onChange,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="relative flex items-center">
      <select
        onChange={onChange}
        {...props}
        className={cn(
          "w-full bg-background border border-border text-sm text-text-primary",
          "rounded-sm py-2.5 pl-3 pr-8 transition-colors appearance-none",
          "hover:border-border-strong focus:border-primary/50 focus:outline-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          className,
        )}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-background text-text-primary px-20"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        className="absolute right-3 w-4 h-4 text-text-muted pointer-events-none"
        strokeWidth={2}
      />
    </div>
  );
}
