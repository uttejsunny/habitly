import { useCallback, useEffect, useState } from "react";
import { createWardrobeItem, deleteWardrobeItem, listWardrobeItems, markWornToday } from "./repository";
import type { NewWardrobeItemInput, WardrobeItem } from "./types";

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await listWardrobeItems();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (input: NewWardrobeItemInput) => {
      await createWardrobeItem(input);
      await refresh();
    },
    [refresh]
  );

  const markWorn = useCallback(
    async (id: number) => {
      await markWornToday(id);
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (id: number) => {
      await deleteWardrobeItem(id);
      await refresh();
    },
    [refresh]
  );

  return { items, loading, refresh, addItem, markWorn, removeItem };
}
