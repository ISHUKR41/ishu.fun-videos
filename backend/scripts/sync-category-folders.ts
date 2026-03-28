import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { categorySeedData, type CategorySeed } from "../src/data/categories.js";

const backendCategoriesDir = path.resolve(process.cwd(), "storage", "categories");
const frontendCategoriesDir = path.resolve(process.cwd(), "..", "frontend", "src", "content", "categories");
const prisma = new PrismaClient();

type SyncCategory = CategorySeed;

async function ensureDirectory(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function ensureFile(filePath: string, content: string) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, content, "utf8");
  }
}

async function writeMetadataFiles(categoryPath: string, category: SyncCategory) {
  await fs.writeFile(
    path.join(categoryPath, "meta.json"),
    `${JSON.stringify(
      {
        code: category.code,
        slug: category.slug,
        name: category.name,
        group: category.group,
        description: category.description
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

async function loadCategories(): Promise<{ source: "database" | "seed"; categories: SyncCategory[] }> {
  if (!process.env.DATABASE_URL) {
    return {
      source: "seed",
      categories: categorySeedData
    };
  }

  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
      select: {
        code: true,
        name: true,
        slug: true,
        group: true,
        description: true
      }
    });

    if (categories.length > 0) {
      return {
        source: "database",
        categories
      };
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown DB error";
    console.warn(`Database category fetch failed, falling back to seed categories: ${reason}`);
  }

  return {
    source: "seed",
    categories: categorySeedData
  };
}

async function syncFolders() {
  const { source, categories } = await loadCategories();

  await ensureDirectory(backendCategoriesDir);
  await ensureDirectory(frontendCategoriesDir);

  for (const category of categories) {
    const backendCategoryPath = path.join(backendCategoriesDir, category.slug);
    const frontendCategoryPath = path.join(frontendCategoriesDir, category.slug);

    await ensureDirectory(backendCategoryPath);
    await ensureDirectory(frontendCategoryPath);

    await ensureFile(path.join(backendCategoryPath, ".gitkeep"), "");
    await ensureFile(path.join(backendCategoryPath, "comments.json"), "[]\n");
    await writeMetadataFiles(backendCategoryPath, category);
    await ensureFile(path.join(frontendCategoryPath, "comments.json"), "[]\n");
    await fs.writeFile(
      path.join(frontendCategoryPath, "README.md"),
      `# ${category.slug}\n\nCategory content folder for ${category.name}.\n\n- Code: ${category.code}\n- Group: ${category.group}\n\n${category.description}\n`,
      "utf8"
    );
    await writeMetadataFiles(frontendCategoryPath, category);
  }

  console.log(`Synced ${categories.length} category folders across backend and frontend using ${source} data.`);
}

syncFolders().catch((error) => {
  console.error("Category folder sync failed", error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
