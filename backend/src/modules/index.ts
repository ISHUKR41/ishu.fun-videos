import { Router } from "express";
import { authRouter } from "./auth/auth.routes.js";
import { categoriesRouter } from "./categories/categories.routes.js";
import { commentsRouter } from "./comments/comments.routes.js";
import { videosRouter } from "./videos/videos.routes.js";
import { adminRouter } from "./admin/admin.routes.js";
import { env } from "../config/env.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use(commentsRouter);
apiRouter.use("/videos", videosRouter);
apiRouter.use(`/${env.ADMIN_HIDE_PATH}`, adminRouter);

apiRouter.get(`/${env.ADMIN_HIDE_PATH}/health`, (_req, res) => {
  return res.json({
    status: "ok",
    visibility: "hidden-admin-surface",
    hint: "Do not expose this path in public UI"
  });
});
