import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tutorlagbe.com";

  // Core static routes with priorities
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/find-tutor`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tuitions`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Key subject landing pages for search engine indexing
  const subjects = ["Mathematics", "Physics", "Chemistry", "English", "ICT", "Biology"];
  const subjectRoutes = subjects.map((subject) => ({
    url: `${baseUrl}/find-tutor?subject=${encodeURIComponent(subject)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Major cities in Bangladesh
  const locations = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet"];
  const locationRoutes = locations.map((city) => ({
    url: `${baseUrl}/find-tutor?location=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  return [...routes, ...subjectRoutes, ...locationRoutes];
}
