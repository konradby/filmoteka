"use client";

import { useEffect } from "react";

import type { Dictionary } from "@/i18n/get-dictionary";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  dictionary: Dictionary;
}

export function LocaleError({ error, reset, dictionary }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">{dictionary.errors.generic}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {dictionary.errors.retry}
      </button>
    </div>
  );
}
