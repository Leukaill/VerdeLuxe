import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

// Default database URL if not provided
const DEFAULT_DATABASE_URL = "postgresql://neondb_owner:npg_9zsuHtE3NGjI@ep-round-dawn-a2u068xy.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const databaseUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

console.log("Connecting to database:", databaseUrl.replace(/:[^:@]+@/, ":****@"));

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });