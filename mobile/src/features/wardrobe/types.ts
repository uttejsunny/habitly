export interface WardrobeItem {
  id: number;
  name: string;
  category: string;
  color: string;
  lastWornDate: string | null; // "YYYY-MM-DD"
  createdAt: string;
}

export interface NewWardrobeItemInput {
  name: string;
  category: string;
  color: string;
}
