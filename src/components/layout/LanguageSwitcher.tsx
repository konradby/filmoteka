"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interactiveLinkClassName } from "@/lib/ui/classes";

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
      <ul className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {(["pl", "en"] as const).map((lang) => {
          const isActive = lang === locale;
          const href =
            lang === locale ? pathname : switchedPath || `/${lang}`;

          return (
            <li key={lang}>
              <Link
                href={href}
                className={`${interactiveLinkClassName} rounded-md px-3 py-1 text-sm font-semibold uppercase transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
                aria-current={isActive ? "true" : undefined}
                lang={lang}
                hrefLang={lang}
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
