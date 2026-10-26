// Aggregates every module's drizzle table definitions into one schema object
// for the drizzle() client - the tables themselves live with their owning
// module (features/<name>/schema.ts), not here.
export * from "../features/habits/schema";
export * from "../features/reminders/schema";
export * from "../features/wardrobe/schema";
