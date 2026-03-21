import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { CONFIG } from "../config/config.js";
import { logIt } from "../utils/utils.js";

const { Pool } = pg;

if (!CONFIG.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined");
}

logIt("Database connection configured");
export const pool = new Pool({
	connectionString: CONFIG.DATABASE_URL,
});

export const db = drizzle(pool);
