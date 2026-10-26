import { eq } from "drizzle-orm";
import { toDateKey } from "../../core/dates";
import { db } from "../../db/client";
import { wardrobeItems } from "../../db/schema";
import type { NewWardrobeItemInput, WardrobeItem } from "./types";

function rowToItem(row: typeof wardrobeItems.$inferSelect): WardrobeItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    color: row.color,
    lastWornDate: row.lastWornDate,
    createdAt: row.createdAt,
  };
}

export async function listWardrobeItems(): Promise<WardrobeItem[]> {
  const rows = await db.select().from(wardrobeItems);
  return rows.map(rowToItem);
}

export async function createWardrobeItem(input: NewWardrobeItemInput): Promise<void> {
  await db.insert(wardrobeItems).values({
    name: input.name,
    category: input.category,
    color: input.color,
    createdAt: new Date().toISOString(),
  });
}

export async function markWornToday(id: number): Promise<void> {
  await db
    .update(wardrobeItems)
    .set({ lastWornDate: toDateKey(new Date()) })
    .where(eq(wardrobeItems.id, id));
}

export async function deleteWardrobeItem(id: number): Promise<void> {
  await db.delete(wardrobeItems).where(eq(wardrobeItems.id, id));
}
