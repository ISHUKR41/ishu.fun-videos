import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { prisma } from "../../config/db.js";
import { requireAuth, requireRoles } from "../../middleware/auth.js";
import { toSlug, uniqueSlug } from "../../utils/slug.js";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;
const CATEGORY_GROUPS = [
  "Content Type",
  "Quality / Format",
  "Region",
  "Creators / Participation",
  "Themes",
  "Style / Appearance",
  "Activity / Engagement"
] as const;

const backendCategoriesDir = path.resolve(process.cwd(), "storage", "categories");
const frontendCategoriesDir = path.resolve(process.cwd(), "..", "frontend", "src", "content", "categories");

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureFile(filePath: string, content: string) {
  if (await pathExists(filePath)) {
    return;
  }

  await fs.writeFile(filePath, content, "utf8");
}

async function syncFolderPath(rootDir: string, oldSlug: string, newSlug: string) {
  await fs.mkdir(rootDir, { recursive: true });

  const oldPath = path.join(rootDir, oldSlug);
  const newPath = path.join(rootDir, newSlug);

  if (oldSlug !== newSlug) {
    const oldExists = await pathExists(oldPath);
    const newExists = await pathExists(newPath);

    if (oldExists && !newExists) {
      await fs.rename(oldPath, newPath);
    }
  }

  await fs.mkdir(newPath, { recursive: true });
  return newPath;
}

async function syncCategoryArtifacts(
  oldSlug: string,
  nextCategory: {
    slug: string;
    name: string;
    code: string;
    group: string;
    description: string;
  }
) {
  const newSlug = nextCategory.slug;
  const backendFolder = await syncFolderPath(backendCategoriesDir, oldSlug, newSlug);
  const frontendFolder = await syncFolderPath(frontendCategoriesDir, oldSlug, newSlug);

  await ensureFile(path.join(backendFolder, ".gitkeep"), "");
  await ensureFile(path.join(backendFolder, "comments.json"), "[]\n");
  await fs.writeFile(
    path.join(backendFolder, "meta.json"),
    `${JSON.stringify(
      {
        code: nextCategory.code,
        slug: newSlug,
        name: nextCategory.name,
        group: nextCategory.group,
        description: nextCategory.description
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  await ensureFile(path.join(frontendFolder, "comments.json"), "[]\n");
  await fs.writeFile(
    path.join(frontendFolder, "README.md"),
    `# ${newSlug}\n\nCategory content folder for ${nextCategory.name}.\n\n- Code: ${nextCategory.code}\n- Group: ${nextCategory.group}\n\n${nextCategory.description}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(frontendFolder, "meta.json"),
    `${JSON.stringify(
      {
        code: nextCategory.code,
        slug: newSlug,
        name: nextCategory.name,
        group: nextCategory.group,
        description: nextCategory.description
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  group: z.enum(CATEGORY_GROUPS).optional()
});

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" }
  });

  return res.json({ categories });
});

categoriesRouter.post(
  "/sync-folders",
  requireAuth,
  requireRoles([...ADMIN_ROLES]),
  async (_req, res) => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" }
    });

    const results: Array<{ slug: string; ok: boolean; message?: string }> = [];

    for (const category of categories) {
      try {
        await syncCategoryArtifacts(category.slug, {
          slug: category.slug,
          name: category.name,
          code: category.code,
          group: category.group,
          description: category.description
        });
        results.push({ slug: category.slug, ok: true });
      } catch (error) {
        results.push({
          slug: category.slug,
          ok: false,
          message: error instanceof Error ? error.message : "Folder sync failed"
        });
      }
    }

    const failed = results.filter((item) => !item.ok);

    return res.json({
      synced: results.length - failed.length,
      failed: failed.length,
      results
    });
  }
);

categoriesRouter.get("/:slug/overview", async (req, res) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const [videoCount, approvedCommentCount, latestVideos] = await Promise.all([
    prisma.video.count({
      where: {
        categoryId: category.id,
        status: "READY"
      }
    }),
    prisma.comment.count({
      where: {
        categoryId: category.id,
        status: "APPROVED"
      }
    }),
    prisma.video.findMany({
      where: {
        categoryId: category.id,
        status: "READY"
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        createdAt: true
      }
    })
  ]);

  return res.json({
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      group: category.group,
      description: category.description
    },
    stats: {
      videos: videoCount,
      comments: approvedCommentCount
    },
    latestVideos
  });
});

categoriesRouter.get("/:slug", async (req, res) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });

  if (category) {
    return res.json({ category });
  }

  const history = await prisma.categorySlugHistory.findFirst({
    where: { oldSlug: req.params.slug },
    orderBy: { createdAt: "desc" }
  });

  if (history) {
    const renamedCategory = await prisma.category.findUnique({ where: { slug: history.newSlug } });

    if (renamedCategory) {
      return res.json({
        category: renamedCategory,
        redirectTo: `/categories/${history.newSlug}`,
        redirectedFrom: history.oldSlug
      });
    }
  }

  return res.status(404).json({ message: "Category not found" });
});

categoriesRouter.patch(
  "/:id",
  requireAuth,
  requireRoles([...ADMIN_ROLES]),
  async (req, res) => {
    const parsed = updateCategorySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid update payload" });
    }

    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });

    if (!existing) {
      return res.status(404).json({ message: "Category not found" });
    }

    let nextSlug = existing.slug;

    if (parsed.data.name && parsed.data.name !== existing.name) {
      const baseSlug = toSlug(parsed.data.name);
      nextSlug = await uniqueSlug(baseSlug, async (candidate) => {
        const found = await prisma.category.findUnique({ where: { slug: candidate } });
        return Boolean(found && found.id !== existing.id);
      });

      await prisma.categorySlugHistory.create({
        data: {
          categoryId: existing.id,
          oldSlug: existing.slug,
          newSlug: nextSlug
        }
      });
    }

    const category = await prisma.category.update({
      where: { id: existing.id },
      data: {
        name: parsed.data.name ?? existing.name,
        description: parsed.data.description ?? existing.description,
        group: parsed.data.group ?? existing.group,
        slug: nextSlug
      }
    });

    let folderSyncStatus: { ok: boolean; message: string } = {
      ok: true,
      message: "Category folders synced"
    };

    try {
      await syncCategoryArtifacts(existing.slug, {
        slug: category.slug,
        name: category.name,
        code: category.code,
        group: category.group,
        description: category.description
      });
    } catch (error) {
      folderSyncStatus = {
        ok: false,
        message: error instanceof Error ? error.message : "Folder sync failed"
      };
    }

    return res.json({
      category,
      folderSync: folderSyncStatus,
      propagation: {
        strategy: "ID-based references",
        result: "Category name/slug updated globally via fresh reads"
      }
    });
  }
);
