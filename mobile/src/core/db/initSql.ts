import { habitsTablesSql } from "../../features/habits/schema";
import { remindersTablesSql } from "../../features/reminders/schema";
import { wardrobeTablesSql } from "../../features/wardrobe/schema";

// Every module's table-creation SQL, run once at startup. Kept separate from
// core/modules/registry.ts (which pulls in each module's full repository, and
// therefore db/client.ts) so db/client.ts can depend on this leaf-level list
// without creating a circular import back through the modules into itself.
// Adding a module means adding it here AND to the registry.
export const allTablesSql: string[] = [habitsTablesSql, remindersTablesSql, wardrobeTablesSql];
