import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Load .env file into process.env.

const envSchema = z.object({
  PORT: z.string().optional().default("3000").transform(Number),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  MONGO_URI: z.string().regex(/^mongodb(\+srv)?:\/\//),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
