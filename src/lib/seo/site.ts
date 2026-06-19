import type { Metadata } from "next";

import { locales, type Locale } from "@/i18n/config";
import { buildSearchUrl } from "@/lib/search/build-search-url";
import { parseSearchSort } from "@/lib/search/sort";

export const getSiteUrl = (): string => {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
};

export const getLocalizedPath = (locale: Locale, path = ""): string => {
  if (!path) {
    return `/${locale}`;
  }

  return path.startsWith("/") ? `/${locale}${path}` : `/${locale}/${path}`;
}

export const getLocalizedUrl = (locale: Locale, path = ""): string => {
  return `${getSiteUrl()}${getLocalizedPath(locale, path)}`;
};

export const getSearchUrl = (
  locale: Locale,
  params: Record<string, string | undefined>,
): string => {
  return `${getSiteUrl()}${buildSearchUrl(locale, {
    q: params.q ?? "",
    year: params.year,
    type: params.type,
    page: params.page ? Number.parseInt(params.page, 10) || 1 : 1,
    sort: parseSearchSort(params.sort),
  })}`;
}

export const getLanguageAlternates = (path = ""): Record<string, string> => {
  return Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedUrl(locale, path)]),
  );
};

export const buildPageMetadata = ({
  locale,
  title,
  description,
  path = "",
  canonicalUrl,
  openGraph,
  twitter,
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  canonicalUrl?: string;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
}): Metadata => {
  const url = canonicalUrl ?? getLocalizedUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Filmoteka",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      type: "website",
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
