import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { requireAuth, requireRoles } from "../../middleware/auth.js";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;
const VIDEO_STATUS = {
  UPLOADING: "UPLOADING",
  READY: "READY"
} as const;

const initiateUploadSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(8),
  categoryId: z.string().min(5),
  fileName: z.string().min(3).max(180)
});

const completeUploadSchema = z.object({
  videoId: z.string().min(5),
  durationSec: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional()
});

const seoSuggestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(12),
  categoryName: z.string().min(2)
});

export const adminRouter = Router();

function sanitizeFileName(fileName: string): string {
  const collapsed = fileName.trim().replace(/\s+/g, "-");
  const stripped = collapsed.replace(/[^a-zA-Z0-9._-]/g, "");
  const withoutTraversal = stripped.replace(/\.{2,}/g, ".").replace(/[\/\\]/g, "");
  const safe = withoutTraversal.slice(0, 120);

  return safe.length > 0 ? safe : "video-upload.mp4";
}

adminRouter.use(requireAuth, requireRoles([...ADMIN_ROLES]));

adminRouter.post("/upload/initiate", async (req, res) => {
  const parsed = initiateUploadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid upload payload" });
  }

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const safeFileName = sanitizeFileName(parsed.data.fileName);
  const storageKey = `categories/${category.slug}/${Date.now()}-${safeFileName}`;

  const video = await prisma.video.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      uploaderId: req.auth!.userId,
      storageKey,
      status: VIDEO_STATUS.UPLOADING
    }
  });

  const uploadUrl = `${env.AWS_CLOUDFRONT_BASE}/upload-signed/${storageKey}`;

  return res.status(201).json({
    videoId: video.id,
    storageKey,
    uploadUrl,
    expiresInSec: 600
  });
});

adminRouter.post("/upload/complete", async (req, res) => {
  const parsed = completeUploadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid upload completion payload" });
  }

  const existingVideo = await prisma.video.findUnique({
    where: { id: parsed.data.videoId },
    select: {
      id: true,
      status: true
    }
  });

  if (!existingVideo) {
    return res.status(404).json({ message: "Video not found" });
  }

  if (existingVideo.status === VIDEO_STATUS.READY) {
    return res.status(409).json({ message: "Video is already marked as ready" });
  }

  const video = await prisma.video.update({
    where: { id: existingVideo.id },
    data: {
      durationSec: parsed.data.durationSec,
      thumbnailUrl: parsed.data.thumbnailUrl,
      status: VIDEO_STATUS.READY
    }
  });

  return res.json({ message: "Upload marked as ready", video });
});

adminRouter.post("/seo/suggest", async (req, res) => {
  const parsed = seoSuggestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid SEO payload" });
  }

  const category = parsed.data.categoryName.trim();
  const cleanTitle = parsed.data.title.trim();
  const description = parsed.data.description.trim();
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const titleTokens = cleanTitle
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2)
    .slice(0, 6);

  const categoryTokens = category
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2)
    .slice(0, 3);

  const primaryKeywords = Array.from(
    new Set([
      `${category} videos`,
      `${category} watch online`,
      `${category} streaming`,
      `${cleanTitle} video`,
      `${cleanTitle} watch`,
      `ishu ${category.toLowerCase()}`,
      `ishu.fun ${category.toLowerCase()} videos`
    ])
  );

  const secondaryKeywords = Array.from(
    new Set([
      `${category} creator clips`,
      `${category} high quality video`,
      `${category} trending moments`,
      "ishu video platform",
      "ishufun streaming",
      "ishu.fun creator videos",
      "admin curated videos",
      "professional streaming website",
      "seo optimized video"
    ])
  );

  const baseKeywords = Array.from(
    new Set([
      category,
      ...primaryKeywords,
      ...secondaryKeywords,
      ...titleTokens,
      ...categoryTokens,
      "ishu",
      "ishu.fun",
      "ishufun",
      "video platform",
      "high quality streaming",
      "video seo optimization",
      "video discovery platform"
    ])
  );

  const titleSuggestions = [
    `${cleanTitle} | ${category} on ISHU.FUN`,
    `${category}: ${cleanTitle} | Watch on ISHU.FUN`,
    `${cleanTitle} - Premium ${category} Video`,
    `${cleanTitle} (${category}) - Smooth HD Streaming`
  ];

  const compactDescription = description.length > 145 ? `${description.slice(0, 142)}...` : description;
  const descriptionSuggestion = `${compactDescription} Watch now on ISHU.FUN for smooth playback, pro-grade quality, and category-smart discovery with moderated engagement.`;

  const slugSuggestion = slugify(`${cleanTitle} ${category}`).slice(0, 80);
  const hashtagSuggestions = baseKeywords
    .map((keyword) => keyword.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim())
    .filter((keyword) => keyword.length > 2)
    .slice(0, 8)
    .map((keyword) => `#${keyword.replace(/\s+/g, "")}`);

  const keywordCoverage = Math.min(100, 40 + titleTokens.length * 8 + categoryTokens.length * 6);
  const descriptionClarity = Math.min(100, description.length >= 120 ? 95 : 70 + Math.floor(description.length / 6));
  const relevance = Math.min(100, 65 + Math.min(35, primaryKeywords.length * 7));
  const seoScore = Math.round((keywordCoverage + descriptionClarity + relevance) / 3);

  return res.json({
    titleSuggestions,
    descriptionSuggestion,
    keywords: baseKeywords,
    slugSuggestion,
    hashtagSuggestions,
    keywordClusters: {
      primary: primaryKeywords,
      secondary: secondaryKeywords
    },
    seoScore,
    scoringBreakdown: {
      relevance,
      keywordCoverage,
      descriptionClarity
    }
  });
});
