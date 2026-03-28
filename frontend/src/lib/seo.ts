import { Category } from "@/lib/categories";
import { absoluteUrl, siteConfig } from "@/lib/site";

function dedupeKeywords(keywords: string[]): string[] {
  const normalized = new Map<string, string>();

  for (const keyword of keywords) {
    const value = keyword.trim();

    if (!value) {
      continue;
    }

    const key = value.toLowerCase();

    if (!normalized.has(key)) {
      normalized.set(key, value);
    }
  }

  return Array.from(normalized.values());
}

export function categoryTitle(category: Category): string {
  return `${category.name} Videos | ${siteConfig.name}`;
}

export function categoryDescription(category: Category): string {
  return `${category.description} Watch premium ${category.name} content with smooth playback, moderated comments, and admin-curated discovery.`;
}

export function keywordsForCategory(category: Category): string[] {
  const plainSlug = category.slug.replace(/-/g, " ");
  const brandTerms = siteConfig.brandAliases.map((value) => value.toLowerCase());
  const longTail = [
    `${category.name} videos`,
    `${plainSlug} video collection`,
    `${plainSlug} watch online`,
    `${plainSlug} creators`,
    `${category.group.toLowerCase()} category videos`,
    `${category.name.toLowerCase()} streaming platform`,
    `${category.name.toLowerCase()} community comments`,
    `${category.name.toLowerCase()} curated library`,
    `${siteConfig.name.toLowerCase()} ${plainSlug} videos`,
    `${siteConfig.name.toLowerCase()} ${category.group.toLowerCase()} category`,
    `ishu ${plainSlug} videos`,
    `ishu.fun ${category.name.toLowerCase()}`,
    `${category.name.toLowerCase()} seo optimized page`,
    `${category.name.toLowerCase()} discovery page`,
    `${plainSlug} hd streaming`,
    `${plainSlug} smooth playback`,
    `${plainSlug} admin curated uploads`,
    `${plainSlug} modern video platform`,
    `${plainSlug} trending clips`,
    `ishufun ${plainSlug} category`,
    `ishu fun ${plainSlug}`,
    `${category.name.toLowerCase()} long tail seo`,
    "video platform",
    "streaming website",
    "admin curated videos",
    "seo optimized category page",
    "high quality streaming",
    "fast loading video website",
    "seo ai optimization",
    "schema markup category page"
  ];

  return dedupeKeywords([...(category.seoKeywords || []), ...brandTerms, ...longTail]).slice(0, 30);
}

export function faqSchemaForCategory(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What kind of videos are in ${category.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: category.description
        }
      },
      {
        "@type": "Question",
        name: "Who can upload videos on this platform?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only verified admin roles can upload and publish videos. Community users can browse and comment on approved content."
        }
      },
      {
        "@type": "Question",
        name: "Does this category support comments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every category page supports moderated comments for signed-in users."
        }
      }
    ]
  };
}

export function categorySchema(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: categoryDescription(category),
    url: absoluteUrl(`/categories/${category.slug}`),
    keywords: keywordsForCategory(category).join(", "),
    inLanguage: "en",
    audience: {
      "@type": "Audience",
      audienceType: "video viewers"
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    }
  };
}
