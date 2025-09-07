import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://resumes.ge";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Auth and private areas should not be indexed
          "/sign-in",
          "/sign-up",
          "/resumes",
          "/editor",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
