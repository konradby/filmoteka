import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LandingHero } from "@/components/home/LandingHero";
import { LandingSearchForm } from "@/components/home/LandingSearchForm";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildSearchUrl } from "@/lib/search/build-search-url";
import { parseSearchSort } from "@/lib/search/sort";
import { buildPageMetadata } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    year?: string;
    type?: string;
    page?: string;
    sort?: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: HomePageProps): Promise<Metadata> => {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return buildPageMetadata({
    locale,
    title: dictionary.meta.defaultTitle,
    description: dictionary.meta.defaultDescription,
  });
}

const hasLegacySearchParams = (searchParams: {
  q?: string;
  year?: string;
  type?: string;
  page?: string;
  sort?: string;
}) => {
  return Boolean(
    searchParams.q?.trim() ||
      searchParams.year?.trim() ||
      searchParams.type?.trim() ||
      searchParams.page ||
      searchParams.sort,
  );
};

const HomePage = async ({ params, searchParams }: HomePageProps) => {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = await searchParams;

  if (hasLegacySearchParams(resolvedSearchParams)) {
    redirect(
      buildSearchUrl(locale, {
        q: resolvedSearchParams.q ?? "",
        year: resolvedSearchParams.year,
        type: resolvedSearchParams.type,
        page: Number.parseInt(resolvedSearchParams.page ?? "1", 10) || 1,
        sort: parseSearchSort(resolvedSearchParams.sort),
      }),
    );
  }

  return (
    <main id={`main-content-${locale}`} className="flex-1 w-full">
      <LandingHero dictionary={dictionary}>
        <LandingSearchForm locale={locale} dictionary={dictionary} />
      </LandingHero>
    </main>
  );
};

export default HomePage;
