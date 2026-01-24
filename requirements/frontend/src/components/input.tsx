import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full
            rounded-md
            border
            px-3
            py-2
            text-sm
            outline-none
            transition
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
            focus:ring-2
            ${className || ""}
          `}
          {...props}
        />

        {error && (
          <span className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
