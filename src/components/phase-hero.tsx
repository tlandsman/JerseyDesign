import { getPhase } from "@/lib/phase";
import { Phase } from "@/db/schema";

const phaseSubtitles: Record<Phase, string> = {
  submit: "Submit up to 3 jersey designs for team",
  round1: "Pick your top 3 designs",
  round2: "Select winner from finalists",
  results: "Our new jersey design has been chosen",
};

export async function PhaseHero() {
  const phase = await getPhase();

  return (
    <div className="text-center py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
        Primed Ultimate Jersey Contest
      </h1>
      <p className="text-muted-foreground mt-2">
        {phaseSubtitles[phase]}
      </p>
    </div>
  );
}
