import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface SkipLinkProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SkipLink({ locale, dictionary }: SkipLinkProps) {
  return (
    <a
      href={`#main-content-${locale}`}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
    >
      {dictionary.a11y.skipToContent}
    </a>
  );
}
