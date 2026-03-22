"use server";

import { revalidatePath } from "next/cache";
import { advancePhase } from "@/lib/phase";

export async function advancePhaseAction() {
  const newPhase = await advancePhase();
  revalidatePath("/");
  revalidatePath("/admin");
  return newPhase;
}
