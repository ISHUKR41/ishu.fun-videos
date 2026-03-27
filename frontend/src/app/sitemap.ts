import type { MetadataRoute } from "next";
import { fetchCategories, fetchVideos } from "@/lib/api";
import { categorySeed } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, videos] = await Promise.all([fetchCategories(), fetchVideos()]);
  const categorySource = categories.length > 0 ? categories : categorySeed;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "daily",
      priority: 1,
      lastModified: now
    },
    {
      url: `${siteConfig.url}/watch/featured-launch-film`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: now
    },
    {
      url: `${siteConfig.url}/categories`,
      changeFrequency: "daily",
      priority: 0.95,
      lastModified: now
    }
  ];

  const categoryPages: MetadataRoute.Sitemap = categorySource.map((category, index) => {
    const priority = index < 10 ? 0.9 : 0.85;

    return {
      url: `${siteConfig.url}/categories/${category.slug}`,
      changeFrequency: "weekly",
      priority,
      lastModified: now
    };
  });

  const watchPages: MetadataRoute.Sitemap = videos.slice(0, 24).map((video) => ({
    url: `${siteConfig.url}/watch/${video.id}`,
    changeFrequency: "daily",
    priority: 0.8,
    lastModified: video.createdAt ? new Date(video.createdAt) : now
  }));

  return [...staticPages, ...categoryPages, ...watchPages];
}
