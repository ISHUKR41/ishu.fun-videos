import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { categorySeedData } from "../src/data/categories.js";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMeNow@123", 12);

  await prisma.user.upsert({
    where: { email: "owner@prostream.local" },
    create: {
      email: "owner@prostream.local",
      displayName: "Platform Owner",
      passwordHash,
      role: "SUPER_ADMIN"
    },
    update: {
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  for (const category of categorySeedData) {
    await prisma.category.upsert({
      where: { code: category.code },
      create: {
        code: category.code,
        name: category.name,
        slug: category.slug,
        group: category.group,
        description: category.description
      },
      update: {
        name: category.name,
        slug: category.slug,
        group: category.group,
        description: category.description,
        isActive: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
