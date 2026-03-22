import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export type Phase = "submit" | "round1" | "round2" | "results";

export const appState = sqliteTable("app_state", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  currentPhase: text("current_phase").$type<Phase>().notNull().default("submit"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
