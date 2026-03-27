import { promises as fs } from "node:fs";
import path from "node:path";
import { categorySeedData } from "../src/data/categories.js";

const backendCategoriesDir = path.resolve(process.cwd(), "storage", "categories");
const frontendCategoriesDir = path.resolve(process.cwd(), "..", "frontend", "src", "content", "categories");

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

async function syncFolders() {
  await ensureDirectory(backendCategoriesDir);
  await ensureDirectory(frontendCategoriesDir);

  for (const category of categorySeedData) {
    const backendCategoryPath = path.join(backendCategoriesDir, category.slug);
    const frontendCategoryPath = path.join(frontendCategoriesDir, category.slug);

    await ensureDirectory(backendCategoryPath);
    await ensureDirectory(frontendCategoryPath);

    await ensureFile(path.join(backendCategoryPath, ".gitkeep"), "");
    await ensureFile(path.join(backendCategoryPath, "comments.json"), "[]\n");
    await ensureFile(
      path.join(backendCategoryPath, "meta.json"),
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
      )}\n`
    );
    await ensureFile(path.join(frontendCategoryPath, "comments.json"), "[]\n");
    await ensureFile(
      path.join(frontendCategoryPath, "README.md"),
      `# ${category.slug}\n\nCategory content folder for ${category.name}.\n\n- Code: ${category.code}\n- Group: ${category.group}\n\n${category.description}\n`
    );
    await ensureFile(
      path.join(frontendCategoryPath, "meta.json"),
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
      )}\n`
    );
  }

  console.log(`Synced ${categorySeedData.length} category folders across backend and frontend.`);
}

syncFolders().catch((error) => {
  console.error("Category folder sync failed", error);
  process.exit(1);
});
