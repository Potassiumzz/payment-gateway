import { MAX_INPUT_LENGTH, MAX_PIN_DIGITS } from "@/constants/config";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

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
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (type === "number" && ["e", "E", "", "-"].includes(e.key)) {
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
        type={inputType}
        maxLength={isPasswordField ? MAX_PIN_DIGITS : MAX_INPUT_LENGTH}
        autoComplete={isPasswordField ? "one-time-code" : "off"}
        pattern={isPasswordField ? "[0-9]*" : undefined}
        inputMode={isPasswordField ? "numeric" : undefined}
        {...props}
				className={cn(
					"w-full bg-background border border-border text-sm text-text-primary",
					"placeholder:text-text-muted rounded-sm py-2.5 transition-colors",
					"hover:border-border-strong focus:border-primary/50 focus:outline-none",
					"disabled:opacity-40 disabled:cursor-not-allowed",
					// kill the number spinners
					"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					leftIcon ? "pl-7" : "pl-3",
					(rightIcon || isPasswordField )? "pr-7" : "pr-3",
					className,
				)}
			/>
       {isPasswordField ? (
         <button
           type="button"
           aria-label={showPassword ? "Hide pin" : "Show pin"}
           onClick={() => setShowPassword((v) => !v)}
           className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
         >
           {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
         </button>
       ) : (
         rightIcon && (
           <span className="absolute right-3 font-mono text-sm text-text-muted pointer-events-none">
             {rightIcon}
           </span>
         )
       )}
		</div>
	);
}
