import { defineConfig } from "drizzle-kit";
import { logError } from "./src/utils/utils";

if (!process.env.DATABASE_URL) {
	// We can't throw here if we want to run `drizzle-kit` without loading the .env in some contexts, but usually it's fine.
	// Actually, let's keep it robust.
	logError(
		"drizzle.config.js:",
		"DATABASE_URL is not set. Please set it in your environment variables.",
	);
}

export default defineConfig({
	schema: "./src/db/schema.js",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
