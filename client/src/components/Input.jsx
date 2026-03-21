import { forwardRef } from "react";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
	return (
		<div className="flex flex-col gap-1 w-full">
			{label && (
				<label htmlFor={props.name} className="text-sm font-medium text-(--color-foreground)">
					{label}
				</label>
			)}
			<input
				id={props.name}
				ref={ref}
				className={`
					w-full px-4 py-3 rounded-xl
					bg-(--color-background) border text-(--color-foreground)
					focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:border-transparent
					transition-colors
					${error ? "border-red-500 focus:ring-red-500" : "border-(--color-border)"}
					${className}
				`}
				{...props}
			/>
			{error && <span className="text-sm text-red-500 mt-1">{error}</span>}
		</div>
	);
});

Input.displayName = "Input";

export default Input;
