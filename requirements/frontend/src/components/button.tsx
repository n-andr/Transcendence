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
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium transition focus:outline-none";

const variants = {
  primary:
    "bg-green-500 text-green-50 font-semibold " +
    "shadow-[0_6px_0_0_#15803d] " + // darker green “base”
    "hover:translate-y-1 hover:shadow-[0_4px_0_0_#15803d] " +
    "active:translate-y-2 active:shadow-[0_2px_0_0_#15803d] " +
    "transition-all duration-150 ease-out",

  secondary:
  "bg-white text-gray-700 border border-gray-300 " +
  "hover:bg-gray-50 hover:border-gray-400 " +
  "transition-colors " +
  "focus:outline-none",
};

const disabledStyles =
  "opacity-50 cursor-not-allowed translate-y-0 shadow-none";


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
