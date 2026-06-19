import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo/site";

const robots = (): MetadataRoute.Robots => {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
};

export default robots;
