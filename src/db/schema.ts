import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export type Phase = "submit" | "round1" | "round2" | "round3" | "results";

export const appState = sqliteTable("app_state", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  currentPhase: text("current_phase").$type<Phase>().notNull().default("submit"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const designs = sqliteTable("designs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  submitterName: text("submitter_name").notNull(),
  submitterToken: text("submitter_token").notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
});

export type VoteRound = "round1" | "round2" | "round3";

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  voterToken: text("voter_token").notNull(),
  round: text("round").$type<VoteRound>().notNull(),
  firstChoice: integer("first_choice").notNull(),
  secondChoice: integer("second_choice").notNull(),
  thirdChoice: integer("third_choice").notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
}, (t) => [
  unique().on(t.voterToken, t.round),
]);

export const results = sqliteTable("results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  round: text("round").$type<VoteRound>().notNull().unique(),
  finalistIds: text("finalist_ids").notNull(),
  totalVoters: integer("total_voters").notNull(),
  eliminationData: text("elimination_data"),
  computedAt: integer("computed_at", { mode: "timestamp" }).notNull(),
});
