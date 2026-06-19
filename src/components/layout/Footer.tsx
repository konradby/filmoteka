import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface FooterProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function Footer({ locale, dictionary }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-sm text-muted">{dictionary.footer.tagline}</p>
        <p className="mt-2 text-xs text-muted">{dictionary.footer.dataSource}</p>
      </div>
    </footer>
  );
}
