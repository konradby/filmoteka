"use client";

import { useToast } from "@/lib/ui/toast/context";

interface ToastContainerProps {
  dismissLabel: string;
}

export function ToastContainer({ dismissLabel }: ToastContainerProps) {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
            toast.variant === "success"
              ? "border-accent/40 bg-surface/95 text-foreground"
              : "border-red-500/40 bg-surface/95 text-foreground"
          }`}
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              toast.variant === "success"
                ? "bg-accent text-accent-foreground"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.variant === "success" ? "✓" : "!"}
          </span>
          <p className="flex-1 text-sm leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 rounded-md px-1 text-sm text-muted transition-colors hover:text-foreground"
            aria-label={dismissLabel}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
