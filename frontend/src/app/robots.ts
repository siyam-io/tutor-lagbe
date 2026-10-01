import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://tutorlagbe.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard/*",
          "/messages",
          "/settings",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
