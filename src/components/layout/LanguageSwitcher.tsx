"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface LanguageSwitcherProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function LanguageSwitcher({
  locale,
  dictionary,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const otherLocale: Locale = locale === "pl" ? "en" : "pl";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <nav aria-label={dictionary.a11y.languageSwitcher}>
      <ul className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
        {(["pl", "en"] as const).map((lang) => {
          const isActive = lang === locale;
          const href =
            lang === locale ? pathname : switchedPath || `/${lang}`;

          return (
            <li key={lang}>
              <Link
                href={href}
                className={`rounded-md px-3 py-1 text-sm font-medium uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
                aria-current={isActive ? "true" : undefined}
                lang={lang}
              >
                {lang}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
