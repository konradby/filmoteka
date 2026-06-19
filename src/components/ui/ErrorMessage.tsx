interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-red-300"
    >
      {message}
    </div>
  );
}
