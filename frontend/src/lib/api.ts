import { Category, CategoryGroup, categoryGroups, categorySeed, findCategoryBySlug, getCategoryCode } from "@/lib/categories";

type NextRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

const localApiBase = "http://localhost:4000/api";
const productionApiBase = "https://api.prostream.app/api";
const requestTimeoutMs = 5000;
const maxConsecutiveFailures = 3;
const failureCooldownMs = 30000;

function normalizeApiBase(url: string): string {
  return url.replace(/\/+$/, "");
}

const configuredApiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "").trim();
const runningOnVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const pointsToLocalhost = /localhost|127\.0\.0\.1/i.test(configuredApiBase);
const effectiveConfiguredApiBase = runningOnVercel && pointsToLocalhost ? productionApiBase : configuredApiBase;
const defaultApiBase = process.env.NODE_ENV === "production" ? productionApiBase : localApiBase;
const apiBase = normalizeApiBase(effectiveConfiguredApiBase || defaultApiBase);

let consecutiveFailures = 0;
let circuitOpenUntil = 0;

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

function isCircuitOpen() {
  return Date.now() < circuitOpenUntil;
}

function registerFailure() {
  consecutiveFailures += 1;

  if (consecutiveFailures >= maxConsecutiveFailures) {
    circuitOpenUntil = Date.now() + failureCooldownMs;
  }
}

function registerSuccess() {
  consecutiveFailures = 0;
  circuitOpenUntil = 0;
}

async function parseJson<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    if (response.status >= 500) {
      registerFailure();
    }

    return null;
  }

  try {
    const data = (await response.json()) as T;
    registerSuccess();
    return data;
  } catch {
    registerFailure();
    return null;
  }
}

async function fetchApi<T>(path: string, init: NextRequestInit = {}): Promise<T | null> {
  if (isCircuitOpen()) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      signal: controller.signal
    });

    return parseJson<T>(response);
  } catch {
    registerFailure();
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const payload = await fetchApi<{ categories: ApiCategory[] }>("/categories", {
    next: { revalidate: 120 }
  });

  return payload?.categories?.length
    ? payload.categories.map((record) => toCategory(record))
    : categorySeed;
}

export type CategoryLookupResult = {
  category: Category | null;
  redirectTo?: string;
  redirectedFrom?: string;
};

export async function fetchCategoryLookup(slug: string): Promise<CategoryLookupResult> {
  const payload = await fetchApi<{
    category?: ApiCategory | null;
    redirectTo?: string;
    redirectedFrom?: string;
  }>(`/categories/${slug}`, {
    next: { revalidate: 120 }
  });

  if (payload?.category) {
    return {
      category: toCategory(payload.category),
      redirectTo: payload.redirectTo,
      redirectedFrom: payload.redirectedFrom
    };
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
  const payload = await fetchApi<{ comments: CommentRecord[] }>(`/categories/${slug}/comments`, {
    cache: "no-store"
  });

  return payload?.comments || [];
}

export async function fetchCategoryOverview(slug: string): Promise<CategoryOverview | null> {
  const payload = await fetchApi<{
    stats?: { videos?: number; comments?: number };
    latestVideos?: ApiVideo[];
  }>(`/categories/${slug}/overview`, {
    next: { revalidate: 90 }
  });

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
}

export async function fetchVideos(categorySlug?: string): Promise<VideoRecord[]> {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";

  const payload = await fetchApi<{ videos?: ApiVideo[] }>(`/videos${query}`, {
    next: { revalidate: 90 }
  });

  if (!payload?.videos) {
    return [];
  }

  return payload.videos.map((video) => toVideoRecord(video));
}

export async function fetchVideoById(videoId: string): Promise<VideoRecord | null> {
  const payload = await fetchApi<{ video?: ApiVideo }>(`/videos/${videoId}`, {
    next: { revalidate: 90 }
  });

  if (!payload?.video) {
    return null;
  }

  return toVideoRecord(payload.video);
}
