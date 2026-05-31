import { cn } from "@/lib/utils";

type InputProps = {
	id: string;
	type: React.HTMLInputTypeAttribute;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	prefix?: React.ReactNode; // e.g. "$" or an icon
	suffix?: React.ReactNode;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string | number;
	min?: number;
	step?: number;
  name?: string;
};

export function Input({
	id,
	type,
	placeholder,
	className,
	disabled,
	prefix,
	suffix,
	onChange,
	value,
	min,
	step,
  name
}: InputProps) {
	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
			e.preventDefault();
		}
	}

	return (
		<div className="relative flex items-center">
			{prefix && (
				<span className="absolute left-3 font-mono text-sm text-text-muted pointer-events-none">
					{prefix}
				</span>
			)}
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				disabled={disabled}
				value={value}
				min={min}
				step={step}
				onChange={onChange}
				onKeyDown={handleKeyDown}
        name={name}
				className={cn(
					"w-full bg-background border border-border font-mono text-sm text-text-primary",
					"placeholder:text-text-muted rounded-sm py-2.5 transition-colors",
					"hover:border-border-strong focus:border-primary/50 focus:outline-none",
					"disabled:opacity-40 disabled:cursor-not-allowed",
					// kill the number spinners
					"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					prefix ? "pl-7" : "pl-3",
					suffix ? "pr-7" : "pr-3",
					className,
				)}
			/>
			{suffix && (
				<span className="absolute right-3 font-mono text-sm text-text-muted pointer-events-none">
					{suffix}
				</span>
			)}
		</div>
	);
}
