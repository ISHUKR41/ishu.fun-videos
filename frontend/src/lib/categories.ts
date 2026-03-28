import { categorySeedData } from "../../../backend/src/data/categories";

export type CategoryGroup =
  | "Content Type"
  | "Quality / Format"
  | "Region"
  | "Creators / Participation"
  | "Themes"
  | "Style / Appearance"
  | "Activity / Engagement";

export type Category = {
  id: string;
  code?: string;
  name: string;
  slug: string;
  group: CategoryGroup;
  description: string;
  seoKeywords: string[];
};

export const categoryGroups: CategoryGroup[] = [
  "Content Type",
  "Quality / Format",
  "Region",
  "Creators / Participation",
  "Themes",
  "Style / Appearance",
  "Activity / Engagement"
];

const categoryGroupSet = new Set<CategoryGroup>(categoryGroups);

const keywordBoosters: Partial<Record<string, string[]>> = {
  "user-generated": ["ugc creator platform", "community video uploads"],
  "hd-4k": ["ultra hd streaming", "4k video player"],
  "live-streams": ["real time live streaming", "live event platform"],
  "trending-moments": ["viral short videos", "trending creator clips"],
  "tattoo-art": ["tattoo artist videos", "body art creators"],
  "special-interests": ["niche creator communities", "interest-based videos"]
};

function dedupeKeywords(keywords: string[]) {
  const unique = new Map<string, string>();

  for (const item of keywords) {
    const value = item.trim();

    if (!value) {
      continue;
    }

    const normalized = value.toLowerCase();

    if (!unique.has(normalized)) {
      unique.set(normalized, value);
    }
  }

  return Array.from(unique.values());
}

function normalizeGroup(group: string): CategoryGroup {
  if (categoryGroupSet.has(group as CategoryGroup)) {
    return group as CategoryGroup;
  }

  return "Content Type";
}

function buildSeoKeywords(name: string, slug: string, group: CategoryGroup): string[] {
  const plainSlug = slug.replace(/-/g, " ");
  const keywords = [
    `${name.toLowerCase()} videos`,
    `${plainSlug} clips`,
    `${plainSlug} streaming`,
    `${group.toLowerCase()} category videos`,
    `${name.toLowerCase()} watch online`,
    `ishu ${plainSlug}`,
    `ishu.fun ${plainSlug} videos`,
    `ishufun ${name.toLowerCase()} category`,
    `${plainSlug} seo optimized page`,
    `${plainSlug} modern streaming website`,
    `${plainSlug} high quality videos`,
    `${plainSlug} comment enabled category`,
    `${plainSlug} admin curated content`,
    "admin curated video platform",
    "professional streaming website",
    "seo ai optimization"
  ];

  return dedupeKeywords([...(keywordBoosters[slug] || []), ...keywords]);
}

export const categorySeed: Category[] = categorySeedData.map((item) => {
  const group = normalizeGroup(item.group);

  return {
    id: item.code,
    code: item.code,
    name: item.name,
    slug: item.slug,
    group,
    description: item.description,
    seoKeywords: buildSeoKeywords(item.name, item.slug, group)
  };
});

export const categoriesByGroup = categorySeed.reduce<Record<CategoryGroup, Category[]>>(
  (acc, category) => {
    acc[category.group] ||= [];
    acc[category.group].push(category);
    return acc;
  },
  {
    "Content Type": [],
    "Quality / Format": [],
    "Region": [],
    "Creators / Participation": [],
    "Themes": [],
    "Style / Appearance": [],
    "Activity / Engagement": []
  }
);

export function findCategoryBySlug(slug: string): Category | undefined {
  return categorySeed.find((category) => category.slug === slug);
}

export function getCategoryCode(category: Category): string {
  return category.code || category.id;
}
