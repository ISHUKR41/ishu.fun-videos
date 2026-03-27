const fallbackUrl = "https://example.com";

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const siteConfig = {
  name: "ISHU.FUN",
  title: "ISHU.FUN | Admin-Curated Streaming Platform",
  description:
    "ISHU.FUN is a modern, fast video platform with admin-only publishing, 50 category hubs, structured SEO, and smooth product-grade UX inspired by top global product websites.",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl),
  adminHidePath: (process.env.NEXT_PUBLIC_ADMIN_HIDE_PATH || "control-room-9x72").replace(/^\/+|\/+$/g, ""),
  locale: "en_US",
  brandAliases: ["ISHU", "ISHU FUN", "ISHU.FUN", "IshuFun", "ishufun videos"],
  keywords: [
    "ishu",
    "ishu.fun",
    "ishufun",
    "ishu fun videos",
    "ishu video platform",
    "ishu streaming",
    "ishu creator platform",
    "ishufun video upload",
    "ishufun category videos",
    "video platform",
    "admin curated videos",
    "admin only video uploads",
    "modern streaming website",
    "youtube style platform",
    "category based discovery",
    "seo optimized video site",
    "ai seo assistant",
    "smooth scrolling website",
    "professional animated website",
    "structured data seo",
    "fast video discovery",
    "50 category pages",
    "modern creator website",
    "smooth scrolling web app",
    "seo ai optimization",
    "video streaming platform",
    "premium video website",
    "professional video hosting",
    "category video platform",
    "modern web design",
    "3d animated website",
    "apple inspired design",
    "vercel style platform",
    "tesla inspired ui",
    "google material design",
    "microsoft fluent design",
    "stripe checkout experience",
    "figma collaborative design",
    "notion workspace design",
    "airbnb user experience",
    "nike brand design",
    "dropbox file sharing",
    "github developer platform",
    "video content management",
    "video cms platform",
    "professional video site",
    "enterprise video platform",
    "video hosting service",
    "video sharing network"
  ]
} as const;

export function absoluteUrl(pathname: string): string {
  if (!pathname.startsWith("/")) {
    return `${siteConfig.url}/${pathname}`;
  }

  return `${siteConfig.url}${pathname}`;
}
