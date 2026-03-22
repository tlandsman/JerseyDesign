"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  submitVote,
  hasVoted,
  resetRoundVotes,
  resetAllVotes,
  getVotesForRound,
  saveResults,
} from "@/lib/votes";
import { runRCV } from "@/lib/rcv";
import { getPhase, advancePhase } from "@/lib/phase";

const voteSchema = z.object({
  voterToken: z.string().uuid(),
  round: z.enum(["round1", "round2"]),
  firstChoice: z.number().int().positive(),
  secondChoice: z.number().int().positive(),
  thirdChoice: z.number().int().positive(),
});

export async function submitVoteAction(
  voterToken: string,
  round: "round1" | "round2",
  firstChoice: number,
  secondChoice: number,
  thirdChoice: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Validate input with zod
    const parsed = voteSchema.safeParse({
      voterToken,
      round,
      firstChoice,
      secondChoice,
      thirdChoice,
    });

    if (!parsed.success) {
      return { success: false, error: "Invalid vote data" };
    }

    // 2. Check current phase matches round
    const currentPhase = await getPhase();
    if (currentPhase !== round) {
      return { success: false, error: "Voting has ended for this round" };
    }

    // 3. Check hasVoted (redundant but user-friendly error)
    const alreadyVoted = await hasVoted(voterToken, round);
    if (alreadyVoted) {
      return { success: false, error: "You have already voted in this round" };
    }

    // 4. Call submitVote (throws on duplicate due to unique constraint)
    await submitVote(
      parsed.data.voterToken,
      parsed.data.round,
      parsed.data.firstChoice,
      parsed.data.secondChoice,
      parsed.data.thirdChoice
    );

    // 5. Revalidate and return success
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    // Handle unique constraint violation or other errors
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return { success: false, error: "You have already voted in this round" };
    }
    return { success: false, error: "Failed to submit vote. Please try again." };
  }
}

export async function advancePhaseWithRCVAction(): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get current phase
    const currentPhase = await getPhase();

    // 2. If round1 -> round2: compute RCV with target=3, save results
    if (currentPhase === "round1") {
      const ballots = await getVotesForRound("round1");
      if (ballots.length > 0) {
        const rcvResult = runRCV(ballots, 3);
        await saveResults("round1", rcvResult.finalists, rcvResult.totalVoters, rcvResult.rounds);
      }
    }

    // 3. If round2 -> results: compute RCV with target=1, save results
    if (currentPhase === "round2") {
      const ballots = await getVotesForRound("round2");
      if (ballots.length > 0) {
        const rcvResult = runRCV(ballots, 1);
        await saveResults("round2", rcvResult.finalists, rcvResult.totalVoters, rcvResult.rounds);
      }
    }

    // 4. Call advancePhase()
    await advancePhase();

    // 5. Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to advance phase. Please try again." };
  }
}

/**
 * Form-action compatible version for use with HTML forms.
 * Ignores errors (logs them) since form actions must return void.
 */
export async function advancePhaseFormAction(): Promise<void> {
  await advancePhaseWithRCVAction();
}

export async function resetRoundAction(round: "round1" | "round2"): Promise<void> {
  await resetRoundVotes(round);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function resetAllAction(): Promise<void> {
  await resetAllVotes();
  revalidatePath("/");
  revalidatePath("/admin");
}
