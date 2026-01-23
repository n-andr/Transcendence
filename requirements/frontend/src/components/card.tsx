type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`
        w-full
        max-w-lg
        bg-white
        p-12
        rounded-xl
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
