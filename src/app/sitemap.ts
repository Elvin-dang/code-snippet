import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/snippets`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
    },
  ];
}
