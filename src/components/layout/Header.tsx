import Link from "next/link";

import { NavLink } from "@/components/layout/NavLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getSearchBasePath } from "@/lib/search/build-search-url";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export const Header = ({ locale, dictionary }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className={`${interactiveLinkClassName} shrink-0 text-lg font-bold tracking-tight text-accent`}
        >
          {dictionary.nav.appName}
        </Link>
        <nav aria-label={dictionary.a11y.mainNavigation}>
          <ul className="flex flex-wrap gap-4 text-sm font-medium">
            <li>
              <NavLink
                href={getSearchBasePath(locale)}
                locale={locale}
                matchPath="search"
              >
                {dictionary.nav.search}
              </NavLink>
            </li>
            <li>
              <NavLink
                href={`/${locale}/favorites`}
                locale={locale}
                matchPath="favorites"
              >
                {dictionary.nav.favorites}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
