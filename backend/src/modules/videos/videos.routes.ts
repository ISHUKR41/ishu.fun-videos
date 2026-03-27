import { Router } from "express";
import { prisma } from "../../config/db.js";

const VIDEO_STATUS_READY = "READY";

export const videosRouter = Router();

videosRouter.get("/", async (req, res) => {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;

  const videos = await prisma.video.findMany({
    where: {
      status: VIDEO_STATUS_READY,
      ...(categorySlug
        ? {
            category: {
              slug: categorySlug
            }
          }
        : {})
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 30
  });

  return res.json({ videos });
});

videosRouter.get("/:id", async (req, res) => {
  const video = await prisma.video.findUnique({
    where: { id: req.params.id },
    include: {
      category: true,
      uploader: {
        select: {
          id: true,
          displayName: true
        }
      }
    }
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  return res.json({ video });
});
