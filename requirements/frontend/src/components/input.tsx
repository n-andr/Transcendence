type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
};

export function Input({
  label,
  placeholder,
  type = "text",
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
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
        `}
      />

      {error && (
        <span className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
