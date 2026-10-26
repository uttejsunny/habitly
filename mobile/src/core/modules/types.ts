// The contract every feature module (habits, reminders, wardrobe, ...) implements
// so the app's shell (database init, AI context) never needs to know what the
// module actually does. Adding a new module means writing one of these and
// adding it to the registry - nothing else in core/ changes.

export interface ContextSection {
  id: string;
  label: string;
  summary: string;
}

export interface AppModule {
  id: string;
  name: string;
  icon: string;
  /** Raw SQL run once at startup to create this module's own tables. */
  createTablesSql: string;
  /** A snapshot of this module's data for the AI to read, or null if there's nothing worth reporting yet. */
  getAIContext(): Promise<ContextSection | null>;
}
