import type { Metadata } from "next";

import { locales, type Locale } from "@/i18n/config";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getLocalizedPath(locale: Locale, path = ""): string {
  if (!path) {
    return `/${locale}`;
  }

  return path.startsWith("/") ? `/${locale}${path}` : `/${locale}/${path}`;
}

export function getLocalizedUrl(locale: Locale, path = ""): string {
  return `${getSiteUrl()}${getLocalizedPath(locale, path)}`;
}

export function getSearchUrl(
  locale: Locale,
  params: Record<string, string | undefined>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();
  return `${getLocalizedUrl(locale)}${queryString ? `?${queryString}` : ""}`;
}

export function getLanguageAlternates(path = ""): Record<string, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedUrl(locale, path)]),
  );
}

export function buildPageMetadata({
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
}): Metadata {
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
