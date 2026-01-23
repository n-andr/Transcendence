type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  variant = "primary",
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:bg-inherit";

  return (
    <button
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
        ${disabled ? disabledStyles : ""}
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
