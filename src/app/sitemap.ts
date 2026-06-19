import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getSiteUrl } from "@/lib/seo/site";

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = getSiteUrl();

  return locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, `${baseUrl}/${lang}`]),
        ),
      },
    },
    {
      url: `${baseUrl}/${locale}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, `${baseUrl}/${lang}/search`]),
        ),
      },
    },
    {
      url: `${baseUrl}/${locale}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, `${baseUrl}/${lang}/favorites`]),
        ),
      },
    },
  ]);
};

export default sitemap;
