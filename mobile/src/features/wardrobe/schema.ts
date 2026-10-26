import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const wardrobeItems = sqliteTable("wardrobe_items", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  category: text().notNull(),
  color: text().notNull(),
  lastWornDate: text(),
  createdAt: text().notNull(),
});

export const wardrobeTablesSql = `
  CREATE TABLE IF NOT EXISTS wardrobe_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    lastWornDate TEXT,
    createdAt TEXT NOT NULL
  );
`;
