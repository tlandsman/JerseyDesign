import { db } from "@/db";
import { votes, results } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Ballot, RCVRound } from "./rcv";

export type Vote = typeof votes.$inferSelect;
export type Result = typeof results.$inferSelect;

/**
 * Submit a vote for a round. Throws on unique constraint violation (duplicate vote).
 */
export async function submitVote(
  voterToken: string,
  round: "round1" | "round2",
  firstChoice: number,
  secondChoice: number,
  thirdChoice: number
): Promise<void> {
  await db.insert(votes).values({
    voterToken,
    round,
    firstChoice,
    secondChoice,
    thirdChoice,
    submittedAt: new Date(),
  });
}

/**
 * Check if a voter has already voted in a specific round.
 */
export async function hasVoted(voterToken: string, round: "round1" | "round2"): Promise<boolean> {
  const existingVote = await db
    .select()
    .from(votes)
    .where(and(eq(votes.voterToken, voterToken), eq(votes.round, round)))
    .limit(1);

  return existingVote.length > 0;
}

/**
 * Get all votes for a round as Ballot objects for RCV computation.
 */
export async function getVotesForRound(round: "round1" | "round2"): Promise<Ballot[]> {
  const roundVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.round, round));

  return roundVotes.map(v => ({
    firstChoice: v.firstChoice,
    secondChoice: v.secondChoice,
    thirdChoice: v.thirdChoice,
  }));
}

/**
 * Get the count of voters for a specific round.
 */
export async function getVoteCountForRound(round: "round1" | "round2"): Promise<number> {
  const roundVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.round, round));

  return roundVotes.length;
}

/**
 * Reset votes for a specific round.
 */
export async function resetRoundVotes(round: "round1" | "round2"): Promise<void> {
  await db.delete(votes).where(eq(votes.round, round));
  // Also delete results for this round if they exist
  await db.delete(results).where(eq(results.round, round));
}

/**
 * Reset all votes and results.
 */
export async function resetAllVotes(): Promise<void> {
  await db.delete(votes);
  await db.delete(results);
}

/**
 * Save RCV results for a round.
 */
export async function saveResults(
  round: "round1" | "round2",
  finalistIds: number[],
  totalVoters: number,
  eliminationData: RCVRound[]
): Promise<void> {
  // Delete existing results for this round (if re-computing)
  await db.delete(results).where(eq(results.round, round));

  await db.insert(results).values({
    round,
    finalistIds: JSON.stringify(finalistIds),
    totalVoters,
    eliminationData: JSON.stringify(eliminationData),
    computedAt: new Date(),
  });
}

/**
 * Get results for a specific round.
 */
export async function getResults(round: "round1" | "round2"): Promise<{
  finalistIds: number[];
  totalVoters: number;
  eliminationData: RCVRound[];
} | null> {
  const result = await db
    .select()
    .from(results)
    .where(eq(results.round, round))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const r = result[0];
  return {
    finalistIds: JSON.parse(r.finalistIds) as number[],
    totalVoters: r.totalVoters,
    eliminationData: r.eliminationData ? (JSON.parse(r.eliminationData) as RCVRound[]) : [],
  };
}
