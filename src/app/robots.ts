import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [],
    },
    sitemap: `${`https://${process.env.VERCEL_URL}` || "http://localhost:3000"}/sitemap.xml`,
  };
}
