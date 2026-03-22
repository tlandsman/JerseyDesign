import Link from "next/link";
import { getPhase } from "@/lib/phase";
import { Phase } from "@/db/schema";
import { Button } from "@/components/ui/button";

const phaseMessages: Record<Phase, { title: string; subtitle: string }> = {
  submit: {
    title: "Submit Your Designs!",
    subtitle: "Submit up to 3 jersey designs for team",
  },
  round1: {
    title: "Vote for Your Favorites!",
    subtitle: "Pick your top 3 designs",
  },
  round2: {
    title: "Pick the Winner!",
    subtitle: "Choose from the top 3 finalists",
  },
  results: {
    title: "We Have a Winner!",
    subtitle: "Our new jersey design has been chosen",
  },
};

export async function PhaseHero() {
  const phase = await getPhase();
  const message = phaseMessages[phase];

  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Primed Ultimate
      </h1>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
        {message.title}
      </h2>
      <div className="flex items-center justify-center gap-4 mt-4">
        <p className="text-xl text-muted-foreground">
          {message.subtitle}
        </p>
        {phase === "submit" && (
          <Button asChild>
            <Link href="/submit">Upload</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
