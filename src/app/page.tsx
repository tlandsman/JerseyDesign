import { PhaseHero } from "@/components/phase-hero";
import { DesignUploadClient } from "@/components/design-upload-client";
import { DesignGallery } from "@/components/design-gallery";
import { VotingGalleryWrapper } from "@/components/voting-gallery-wrapper";
import { ResultsDisplay } from "@/components/results-display";
import { WinnerDisplay } from "@/components/winner-display";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";
import { getResults } from "@/lib/votes";

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

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Submit phase: upload UI */}
        {isSubmitPhase && (
          <div className="mb-8">
            <DesignUploadClient totalDesigns={designs} />
          </div>
        )}

        {/* Round 1 voting */}
        {isRound1Phase && designs.length > 0 && (
          <VotingGalleryWrapper
            designs={designs}
            round="round1"
          />
        )}

        {/* Round 2: Show Round 1 results, then voting for finalists */}
        {isRound2Phase && round1Results && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Round 1 Results: Top 3 Finalists
              </h2>
              <ResultsDisplay
                finalistIds={round1Results.finalistIds}
                totalVoters={round1Results.totalVoters}
                allDesigns={designs}
                showFinalistsOnly={true}
              />
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Vote for the Winner
              </h2>
              <VotingGalleryWrapper
                designs={designs.filter((d) =>
                  round1Results.finalistIds.includes(d.id)
                )}
                round="round2"
              />
            </div>
          </div>
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
            />
          </div>
        )}

        {/* Submit phase gallery */}
        {isSubmitPhase && designs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Submitted Designs</h2>
            <DesignGallery designs={designs} isAdmin={false} />
          </div>
        )}
      </div>
    </div>
  );
}
