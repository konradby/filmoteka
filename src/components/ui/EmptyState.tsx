interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p
      aria-live="polite"
      className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center text-muted"
    >
      {message}
    </p>
  );
}
