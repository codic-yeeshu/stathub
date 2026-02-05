import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  // We can't throw here if we want to run `drizzle-kit` without loading the .env in some contexts, but usually it's fine.
  // Actually, let's keep it robust.
}

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
});
