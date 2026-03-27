import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/db.js";
import { requireAuth, requireRoles } from "../../middleware/auth.js";

const COMMENT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED"
} as const;

const MODERATION_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR"] as const;

const createCommentSchema = z.object({
  content: z.string().min(3).max(800)
});

const moderateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"])
});

export const commentsRouter = Router();

commentsRouter.get("/categories/:slug/comments", async (req, res) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const comments = await prisma.comment.findMany({
    where: {
      categoryId: category.id,
      status: COMMENT_STATUS.APPROVED
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          displayName: true
        }
      }
    }
  });

  return res.json({
    comments: comments.map((comment: (typeof comments)[number]) => ({
      id: comment.id,
      authorName: comment.author.displayName,
      content: comment.content,
      createdAt: comment.createdAt
    }))
  });
});

commentsRouter.post("/categories/:slug/comments", requireAuth, async (req, res) => {
  const parsed = createCommentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid comment payload" });
  }

  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const comment = await prisma.comment.create({
    data: {
      categoryId: category.id,
      authorId: req.auth!.userId,
      content: parsed.data.content,
      status: COMMENT_STATUS.PENDING
    }
  });

  return res.status(201).json({
    message: "Comment submitted for moderation",
    commentId: comment.id,
    status: comment.status
  });
});

commentsRouter.patch(
  "/comments/:commentId/moderate",
  requireAuth,
  requireRoles([...MODERATION_ROLES]),
  async (req, res) => {
    const parsed = moderateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid moderation payload" });
    }

    const updated = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: { status: parsed.data.status }
    });

    return res.json({ message: "Comment moderated", comment: updated });
  }
);
