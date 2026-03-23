"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  submitVote,
  hasVoted,
  resetRoundVotes,
  resetAllVotes,
  getVoteCountForRound,
  saveResults,
  getPointsForRound,
} from "@/lib/votes";
import { getPhase, advancePhase, setPhase } from "@/lib/phase";

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
    const currentPhase = await getPhase();

    // Round 1: weighted points → clear winner goes to results, tie goes to round 2
    if (currentPhase === "round1") {
      const round1Points = await getPointsForRound("round1");
      const totalVoters = await getVoteCountForRound("round1");
      const pointValues = Object.values(round1Points);
      const maxPoints = pointValues.length > 0 ? Math.max(...pointValues) : 0;
      const designsWithMaxPoints = Object.entries(round1Points)
        .filter(([, points]) => points === maxPoints)
        .map(([designId]) => parseInt(designId));

      if (designsWithMaxPoints.length === 1) {
        // Clear winner - save and skip to results
        await saveResults("round1", designsWithMaxPoints, totalVoters, []);
        await setPhase("results");
      } else {
        // Tie at top - save finalists and go to round 2
        await saveResults("round1", designsWithMaxPoints, totalVoters, []);
        await advancePhase();
      }

      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    }

    // Round 2: weighted points → winner goes to results
    if (currentPhase === "round2") {
      const round2Points = await getPointsForRound("round2");
      const totalVoters = await getVoteCountForRound("round2");
      const pointValues = Object.values(round2Points);
      const maxPoints = pointValues.length > 0 ? Math.max(...pointValues) : 0;
      const winners = Object.entries(round2Points)
        .filter(([, points]) => points === maxPoints)
        .map(([designId]) => parseInt(designId));

      await saveResults("round2", winners, totalVoters, []);
      await setPhase("results");

      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    }

    // Other phases: just advance
    await advancePhase();
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
