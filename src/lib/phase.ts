import { db } from "@/db";
import { appState, Phase } from "@/db/schema";
import { eq } from "drizzle-orm";

export const phaseOrder: Phase[] = ["submit", "round1", "round2", "results"];

export async function getPhase(): Promise<Phase> {
  const [state] = await db.select().from(appState).limit(1);

  // Initialize if no state exists (first run)
  if (!state) {
    await db.insert(appState).values({
      currentPhase: "submit",
      updatedAt: new Date(),
    });
    return "submit";
  }

  return state.currentPhase;
}

export async function advancePhase(): Promise<Phase | null> {
  const [current] = await db.select().from(appState).limit(1);

  if (!current) {
    return null;
  }

  const currentIndex = phaseOrder.indexOf(current.currentPhase);

  if (currentIndex < phaseOrder.length - 1) {
    const nextPhase = phaseOrder[currentIndex + 1];
    await db.update(appState)
      .set({ currentPhase: nextPhase, updatedAt: new Date() })
      .where(eq(appState.id, current.id));
    return nextPhase;
  }

  return current.currentPhase; // Already at results, can't advance
}

export function getNextPhase(current: Phase): Phase | null {
  const currentIndex = phaseOrder.indexOf(current);
  if (currentIndex < phaseOrder.length - 1) {
    return phaseOrder[currentIndex + 1];
  }
  return null;
}

export function getPhaseName(phase: Phase): string {
  const names: Record<Phase, string> = {
    submit: "Submission",
    round1: "Round 1 Voting",
    round2: "Final Vote",
    results: "Results",
  };
  return names[phase];
}
