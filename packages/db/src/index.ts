import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const dbUrl = (process.env.DATABASE_URL ?? "local.db").replace(/^file:/, "");
const sqlite = new Database(dbUrl);

export const db = drizzle(sqlite, { schema });

export * from "./schema";
