"use client";

import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interactiveSelectClassName } from "@/lib/ui/classes";

interface LanguageSwitcherProps {
  locale: Locale;
  dictionary: Dictionary;
}

const localeLabels: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
};

export const LanguageSwitcher = ({
  locale,
  dictionary,
}: LanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;

    if (nextLocale === locale) {
      return;
    }

    const switchedPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(switchedPath || `/${nextLocale}`);
  }

  return (
    <div className="w-full sm:w-auto sm:min-w-[11rem]">
      <label
        htmlFor="footer-language"
        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
      >
        {dictionary.footer.language}
      </label>
      <div className="relative">
        <select
          id="footer-language"
          name="language"
          value={locale}
          onChange={handleChange}
          aria-label={dictionary.a11y.languageSwitcher}
          className={
            interactiveSelectClassName +
            " w-full min-h-10 appearance-none rounded-lg border border-border/80 bg-background px-3 py-2 pr-10 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent/40"
          }
        >
          {locales.map((lang) => (
            <option key={lang} value={lang} lang={lang}>
              {localeLabels[lang]}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
