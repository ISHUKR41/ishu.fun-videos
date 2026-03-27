import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const adminPath = siteConfig.adminHidePath;
  const disallowPaths = ["/api/", "/control-room-9x72"];

  if (!disallowPaths.includes(`/${adminPath}`)) {
    disallowPaths.push(`/${adminPath}`);
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/categories/", "/watch/"],
        disallow: disallowPaths
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url
  };
}
