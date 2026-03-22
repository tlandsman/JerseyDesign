import { getPhase, getPhaseName } from "@/lib/phase";
import { Phase } from "@/db/schema";

const phaseMessages: Record<Phase, { title: string; subtitle: string }> = {
  submit: {
    title: "Submit Your Designs!",
    subtitle: "Share your jersey ideas with the team",
  },
  round1: {
    title: "Vote for Your Favorites!",
    subtitle: "Pick your top 3 designs",
  },
  round2: {
    title: "Final Vote!",
    subtitle: "Choose the winner from the top 3",
  },
  results: {
    title: "And the Winner Is...",
    subtitle: "See the winning jersey design",
  },
};

export async function PhaseHero() {
  const phase = await getPhase();
  const message = phaseMessages[phase];

  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        {message.title}
      </h1>
      <p className="text-xl text-muted-foreground mt-4 max-w-md mx-auto">
        {message.subtitle}
      </p>
    </div>
  );
}
