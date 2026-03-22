import Link from "next/link";
import { PhaseHero } from "@/components/phase-hero";
import { DesignGallery } from "@/components/design-gallery";
import { VotingGalleryWrapper } from "@/components/voting-gallery-wrapper";
import { WinnerDisplay } from "@/components/winner-display";
import { Button } from "@/components/ui/button";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";
import { getResults, getPointsForRound } from "@/lib/votes";

export const dynamic = "force-dynamic";

export default async function Home() {
  const phase = await getPhase();
  const designs = await getDesigns();
  const isSubmitPhase = phase === "submit";
  const isRound1Phase = phase === "round1";
  const isRound2Phase = phase === "round2";
  const isResultsPhase = phase === "results";

  // Fetch results if applicable (D-13: results shown immediately when admin advances phase)
  const round1Results = (isRound2Phase || isResultsPhase)
    ? await getResults("round1")
    : null;
  const round2Results = isResultsPhase
    ? await getResults("round2")
    : null;
  const round2Points = isResultsPhase
    ? await getPointsForRound("round2")
    : {};

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Submit phase: link to upload page */}
        {isSubmitPhase && (
          <div className="text-center mb-8">
            <Button asChild size="lg">
              <Link href="/submit">Submit Your Design</Link>
            </Button>
          </div>
        )}

        {/* Round 1 voting */}
        {isRound1Phase && designs.length > 0 && (
          <VotingGalleryWrapper
            designs={designs}
            round="round1"
          />
        )}

        {/* Round 2: Vote for winner among finalists */}
        {isRound2Phase && round1Results && (
          <VotingGalleryWrapper
            designs={designs.filter((d) =>
              round1Results.finalistIds.includes(d.id)
            )}
            round="round2"
          />
        )}

        {/* Results phase: Show winner (D-14: Users who didn't vote see results like everyone else) */}
        {isResultsPhase && round2Results && (
          <div>
            <WinnerDisplay
              winnerId={round2Results.finalistIds[0]}
              runnerUpIds={round1Results?.finalistIds.filter(
                (id) => id !== round2Results.finalistIds[0]
              ) || []}
              totalVoters={round2Results.totalVoters}
              allDesigns={designs}
              points={round2Points}
            />
          </div>
        )}

        {/* Submit phase gallery - always show during submit phase */}
        {isSubmitPhase && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Submitted Designs</h2>
            {designs.length > 0 ? (
              <DesignGallery designs={designs} isAdmin={false} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No designs submitted yet. Be the first!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
