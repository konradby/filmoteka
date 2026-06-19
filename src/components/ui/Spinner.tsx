interface SpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-8 w-8 border-4",
} as const;

export const Spinner = ({
  label = "Loading",
  size = "md",
  className = "",
}: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <span
        aria-hidden="true"
        className={`animate-spin rounded-full border-border border-t-accent ${sizeClasses[size]}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
