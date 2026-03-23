import { db } from "@/db";
import { votes, results, VoteRound } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Ballot, RCVRound } from "./rcv";

export type Vote = typeof votes.$inferSelect;
export type Result = typeof results.$inferSelect;

/**
 * Submit a vote for a round. Throws on unique constraint violation (duplicate vote).
 */
export async function submitVote(
  voterToken: string,
  round: VoteRound,
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
export async function hasVoted(voterToken: string, round: VoteRound): Promise<boolean> {
  const existingVote = await db
    .select()
    .from(votes)
    .where(and(eq(votes.voterToken, voterToken), eq(votes.round, round)))
    .limit(1);

  return existingVote.length > 0;
}

/**
 * Get a voter's vote for a specific round.
 */
export async function getVoteForUser(
  voterToken: string,
  round: VoteRound
): Promise<{ firstChoice: number; secondChoice: number; thirdChoice: number } | null> {
  const [vote] = await db
    .select()
    .from(votes)
    .where(and(eq(votes.voterToken, voterToken), eq(votes.round, round)))
    .limit(1);

  if (!vote) return null;

  return {
    firstChoice: vote.firstChoice,
    secondChoice: vote.secondChoice,
    thirdChoice: vote.thirdChoice,
  };
}

/**
 * Get all votes for a round as Ballot objects for RCV computation.
 */
export async function getVotesForRound(round: VoteRound): Promise<Ballot[]> {
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
export async function getVoteCountForRound(round: VoteRound): Promise<number> {
  const roundVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.round, round));

  return roundVotes.length;
}

/**
 * Reset votes for a specific round.
 */
export async function resetRoundVotes(round: VoteRound): Promise<void> {
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
  round: VoteRound,
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
 * Calculate points for each design in a round.
 * Round 1: 3 points for 1st choice, 2 for 2nd, 1 for 3rd.
 * Round 2/3: 1 point per vote (single choice).
 */
export async function getPointsForRound(round: VoteRound): Promise<Record<number, number>> {
  const roundVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.round, round));

  const points: Record<number, number> = {};

  for (const vote of roundVotes) {
    if (round === "round2" || round === "round3") {
      // Round 2/3: each vote is 1 point
      points[vote.firstChoice] = (points[vote.firstChoice] || 0) + 1;
    } else {
      // Round 1: weighted points
      points[vote.firstChoice] = (points[vote.firstChoice] || 0) + 3;
      points[vote.secondChoice] = (points[vote.secondChoice] || 0) + 2;
      points[vote.thirdChoice] = (points[vote.thirdChoice] || 0) + 1;
    }
  }

  return points;
}

/**
 * Get tied design IDs from round 2 results (designs with max points).
 */
export async function getTiedDesignIds(): Promise<number[]> {
  const round2Points = await getPointsForRound("round2");
  const pointValues = Object.values(round2Points);
  if (pointValues.length === 0) return [];

  const maxPoints = Math.max(...pointValues);
  return Object.entries(round2Points)
    .filter(([, pts]) => pts === maxPoints)
    .map(([id]) => parseInt(id));
}

/**
 * Get results for a specific round.
 */
export async function getResults(round: VoteRound): Promise<{
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

/**
 * Get all votes for admin voting record.
 */
export async function getAllVotes(): Promise<Vote[]> {
  return db.select().from(votes).orderBy(votes.submittedAt);
}
