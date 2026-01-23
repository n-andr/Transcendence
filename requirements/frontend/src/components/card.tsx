type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`
        w-full
        max-w-sm
        bg-white
        p-6
        rounded-xl
        shadow-sm
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
