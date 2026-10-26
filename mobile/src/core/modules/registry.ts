import { habitsModule } from "../../features/habits/module";
import { remindersModule } from "../../features/reminders/module";
import { wardrobeModule } from "../../features/wardrobe/module";
import type { AppModule } from "./types";

// Every active module in the app. Adding a new one is: write its AppModule
// (schema + AI context), add it here, and give it a screen under src/app/.
export const modules: AppModule[] = [habitsModule, remindersModule, wardrobeModule];
