import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface SkipLinkProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SkipLink({ locale, dictionary }: SkipLinkProps) {
  return (
    <a
      href={`#main-content-${locale}`}
      className={`${interactiveLinkClassName} sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground focus:shadow-lg`}
    >
      {dictionary.a11y.skipToContent}
    </a>
  );
}
