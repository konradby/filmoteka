import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { LocaleHtmlLang } from "@/components/layout/LocaleHtmlLang";
import { SkipLink } from "@/components/layout/SkipLink";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { FavoritesProvider } from "@/lib/favorites/context";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <LocaleHtmlLang locale={locale} />
      <SkipLink locale={locale} dictionary={dictionary} />
      <FavoritesProvider>
        <Header locale={locale} dictionary={dictionary} />
        {children}
      </FavoritesProvider>
    </>
  );
}
