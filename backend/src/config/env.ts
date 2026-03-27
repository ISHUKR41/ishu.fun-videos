import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ADMIN_HIDE_PATH: z.string().default("control-room-9x72"),
  AWS_REGION: z.string().default("ap-south-1"),
  AWS_S3_BUCKET: z.string().default("unset"),
  AWS_CLOUDFRONT_BASE: z.string().default("https://cdn.example.com")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
