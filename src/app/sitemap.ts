import type { MetadataRoute } from "next";

const BASE_URL = "https://resumes.ge";

export default function sitemap(): MetadataRoute.Sitemap {
  // Define public, indexable routes
  const routes = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly" as const,
    },
    {
      path: "tos",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  const entries: MetadataRoute.Sitemap = routes.map((route) => {
    const loc = `${BASE_URL}/${route.path}`.replace(/\/$/, "");
    const url = loc || BASE_URL;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ka: `${BASE_URL}/${route.path}`.replace(/\/$/, ""),
          en: `${BASE_URL}/${route.path}`.replace(/\/$/, ""),
        },
      },
    };
  });

  return entries;
}
