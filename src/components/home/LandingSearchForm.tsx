"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { buildSearchUrl } from "@/lib/search/build-search-url";
import {
  interactiveButtonClassName,
  interactiveInputClassName,
} from "@/lib/ui/classes";

interface LandingSearchFormProps {
  locale: Locale;
  dictionary: Dictionary;
}

export const LandingSearchForm = ({
  locale,
  dictionary,
}: LandingSearchFormProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    setIsPending(true);
    router.push(
      buildSearchUrl(locale, {
        q: trimmedQuery,
        page: 1,
      }),
    );
  }

  return (
    <form
      role="search"
      aria-label={dictionary.a11y.landingSearchForm}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="landing-search-query" className="sr-only">
          {dictionary.search.placeholder}
        </label>
        <input
          id="landing-search-query"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dictionary.search.placeholder}
          className={
            interactiveInputClassName +
            " min-h-12 flex-1 rounded-xl border border-border/80 bg-background/90 px-4 py-3 text-base text-foreground shadow-inner placeholder:text-muted"
          }
          autoComplete="off"
          aria-busy={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          className={
            interactiveButtonClassName +
            " inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_rgba(245,197,24,0.25)] transition-all hover:bg-accent-hover hover:shadow-[0_10px_28px_rgba(245,197,24,0.35)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[9rem]"
          }
        >
          {isPending ? dictionary.search.loading : dictionary.search.submit}
        </button>
      </div>
    </form>
  );
}
