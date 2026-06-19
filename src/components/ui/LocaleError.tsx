"use client";

import { useEffect } from "react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { interactiveButtonClassName } from "@/lib/ui/classes";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  dictionary: Dictionary;
}

export const LocaleError = ({ error, reset, dictionary }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center"
      role="alert"
    >
      <h1 className="text-2xl font-semibold text-foreground">
        {dictionary.errors.generic}
      </h1>
      <p className="mt-2 text-muted">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className={`${interactiveButtonClassName} mt-6 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover`}
      >
        {dictionary.errors.retry}
      </button>
    </div>
  );
}
