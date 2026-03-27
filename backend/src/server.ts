import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRouter } from "./modules/index.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "prostream-backend",
    time: new Date().toISOString()
  });
});

app.use("/api", apiRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
