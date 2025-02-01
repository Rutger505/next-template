import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DISCORD_WEBHOOK_URL: z.string().url(),
    DATABASE_SQLITE_PATH: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .optional()
      .default("development"),
  },
  // Prefixed with NEXT_PUBLIC_
  client: {},
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
