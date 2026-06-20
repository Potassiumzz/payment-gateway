import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	leftIcon?: React.ReactNode; // e.g. "$" or an icon
	rightIcon?: React.ReactNode;
}

export function Input({
  type,
	onChange,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
			e.preventDefault();
		}
	}

	return (
		<div className="relative flex items-center">
			{leftIcon && (
				<span className="absolute left-3 font-mono text-sm text-text-muted pointer-events-none">
					{leftIcon}
				</span>
			)}
			<input
				onChange={onChange}
				onKeyDown={handleKeyDown}
        {...props}
				className={cn(
					"w-full bg-background border border-border font-mono text-sm text-text-primary",
					"placeholder:text-text-muted rounded-sm py-2.5 transition-colors",
					"hover:border-border-strong focus:border-primary/50 focus:outline-none",
					"disabled:opacity-40 disabled:cursor-not-allowed",
					// kill the number spinners
					"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					leftIcon ? "pl-7" : "pl-3",
					rightIcon ? "pr-7" : "pr-3",
					className,
				)}
			/>
			{rightIcon && (
				<span className="absolute right-3 font-mono text-sm text-text-muted pointer-events-none">
					{rightIcon}
				</span>
			)}
		</div>
	);
}
