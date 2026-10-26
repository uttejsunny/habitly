import { daysSince } from "../../core/dates";
import type { AppModule, ContextSection } from "../../core/modules/types";
import { wardrobeTablesSql } from "./schema";
import { listWardrobeItems } from "./repository";

const STALE_AFTER_DAYS = 14;

async function getAIContext(): Promise<ContextSection | null> {
  const items = await listWardrobeItems();
  if (items.length === 0) return null;

  const lines = items.map((item) => {
    if (!item.lastWornDate) return `- ${item.name} (${item.category}, ${item.color}): never worn yet`;
    const idle = daysSince(item.lastWornDate);
    const flag = idle >= STALE_AFTER_DAYS ? ` - not worn in ${idle} days` : "";
    return `- ${item.name} (${item.category}, ${item.color}): last worn ${item.lastWornDate}${flag}`;
  });

  return { id: "wardrobe", label: "Wardrobe", summary: lines.join("\n") };
}

export const wardrobeModule: AppModule = {
  id: "wardrobe",
  name: "Wardrobe",
  icon: "👕",
  createTablesSql: wardrobeTablesSql,
  getAIContext,
};
