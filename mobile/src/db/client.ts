import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { allTablesSql } from "../core/db/initSql";
import * as schema from "./schema";

const sqlite = SQLite.openDatabaseSync("habitai.db");
export const db = drizzle(sqlite, { schema });

export async function initDatabase() {
  for (const sql of allTablesSql) {
    await sqlite.execAsync(sql);
  }
}
