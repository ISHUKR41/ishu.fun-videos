import { Category, CategoryGroup, categoryGroups, categorySeed, findCategoryBySlug, getCategoryCode } from "@/lib/categories";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

type ApiCategory = {
  id: string;
  code?: string;
  name: string;
  slug: string;
  group: string;
  description: string;
};

type ApiVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  createdAt: string;
  durationSec?: number | null;
  category?: {
    name: string;
    slug: string;
  };
};

const categoryGroupSet = new Set<string>(categoryGroups);

function inferSeoKeywords(category: Pick<Category, "name" | "slug" | "group">): string[] {
  return [
    `${category.name.toLowerCase()} videos`,
    `${category.slug.replace(/-/g, " ")} streaming`,
    `${category.group.toLowerCase()} content`,
    `${category.name.toLowerCase()} watch online`,
    `ishu ${category.slug.replace(/-/g, " ")}`,
    `ishu.fun ${category.name.toLowerCase()} videos`,
    `ishufun ${category.group.toLowerCase()} channels`,
    "admin curated video platform"
  ];
}

function dedupeKeywords(items: string[]): string[] {
  const unique = new Map<string, string>();

  for (const item of items) {
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

function normalizeGroup(group: string, fallback?: CategoryGroup): CategoryGroup {
  if (categoryGroupSet.has(group)) {
    return group as CategoryGroup;
  }

  return fallback || "Content Type";
}

function toCategory(record: ApiCategory): Category {
  const seedByCode = record.code ? categorySeed.find((item) => getCategoryCode(item) === record.code) : undefined;
  const seedBySlug = findCategoryBySlug(record.slug);
  const seed = seedByCode || seedBySlug;

  const group = normalizeGroup(record.group, seed?.group);
  const mergedKeywords = dedupeKeywords([
    ...(seed?.seoKeywords || []),
    ...inferSeoKeywords({ name: record.name, slug: record.slug, group })
  ]).slice(0, 20);

  return {
    id: record.id,
    code: record.code || seed?.code || seed?.id,
    name: record.name,
    slug: record.slug,
    group,
    description: record.description,
    seoKeywords: mergedKeywords
  };
}

async function safeJson<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${apiBase}/categories`, {
      next: { revalidate: 120 }
    });
    const payload = await safeJson<{ categories: ApiCategory[] }>(response);

    return payload?.categories?.length
      ? payload.categories.map((record) => toCategory(record))
      : categorySeed;
  } catch {
    return categorySeed;
  }
}

export type CategoryLookupResult = {
  category: Category | null;
  redirectTo?: string;
  redirectedFrom?: string;
};

export async function fetchCategoryLookup(slug: string): Promise<CategoryLookupResult> {
  try {
    const response = await fetch(`${apiBase}/categories/${slug}`, {
      next: { revalidate: 120 }
    });
    const payload = await safeJson<{
      category?: ApiCategory | null;
      redirectTo?: string;
      redirectedFrom?: string;
    }>(response);

    if (payload?.category) {
      return {
        category: toCategory(payload.category),
        redirectTo: payload.redirectTo,
        redirectedFrom: payload.redirectedFrom
      };
    }
  } catch {
    // Fall through to seed fallback.
  }

  const fallback = categorySeed.find((category) => category.slug === slug) || null;
  return { category: fallback };
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const lookup = await fetchCategoryLookup(slug);
  return lookup.category;
}

export type CommentRecord = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type VideoRecord = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  createdAt: string;
  durationSec: number | null;
  category: {
    name: string;
    slug: string;
  } | null;
};

export type CategoryOverview = {
  stats: {
    videos: number;
    comments: number;
  };
  latestVideos: VideoRecord[];
};

function toVideoRecord(video: ApiVideo): VideoRecord {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl || null,
    createdAt: video.createdAt,
    durationSec: video.durationSec ?? null,
    category: video.category
      ? {
          name: video.category.name,
          slug: video.category.slug
        }
      : null
  };
}

export async function fetchCategoryComments(slug: string): Promise<CommentRecord[]> {
  try {
    const response = await fetch(`${apiBase}/categories/${slug}/comments`, {
      cache: "no-store"
    });
    const payload = await safeJson<{ comments: CommentRecord[] }>(response);

    return payload?.comments || [];
  } catch {
    return [];
  }
}

export async function fetchCategoryOverview(slug: string): Promise<CategoryOverview | null> {
  try {
    const response = await fetch(`${apiBase}/categories/${slug}/overview`, {
      next: { revalidate: 90 }
    });
    const payload = await safeJson<{
      stats?: { videos?: number; comments?: number };
      latestVideos?: ApiVideo[];
    }>(response);

    if (!payload) {
      return null;
    }

    return {
      stats: {
        videos: Number(payload.stats?.videos || 0),
        comments: Number(payload.stats?.comments || 0)
      },
      latestVideos: Array.isArray(payload.latestVideos)
        ? payload.latestVideos.map((video) => toVideoRecord(video))
        : []
    };
  } catch {
    return null;
  }
}

export async function fetchVideos(categorySlug?: string): Promise<VideoRecord[]> {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";

  try {
    const response = await fetch(`${apiBase}/videos${query}`, {
      next: { revalidate: 90 }
    });
    const payload = await safeJson<{ videos?: ApiVideo[] }>(response);

    if (!payload?.videos) {
      return [];
    }

    return payload.videos.map((video) => toVideoRecord(video));
  } catch {
    return [];
  }
}

export async function fetchVideoById(videoId: string): Promise<VideoRecord | null> {
  try {
    const response = await fetch(`${apiBase}/videos/${videoId}`, {
      next: { revalidate: 90 }
    });
    const payload = await safeJson<{ video?: ApiVideo }>(response);

    if (!payload?.video) {
      return null;
    }

    return toVideoRecord(payload.video);
  } catch {
    return null;
  }
}
