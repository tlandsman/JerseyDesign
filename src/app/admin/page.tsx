import { PhaseHero } from "@/components/phase-hero";
import { DesignGallery } from "@/components/design-gallery";
import { AdminDesignControls } from "@/components/admin-design-controls";
import { ResultsDisplay } from "@/components/results-display";
import { WinnerDisplay } from "@/components/winner-display";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";
import { getResults } from "@/lib/votes";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const phase = await getPhase();
  const designs = await getDesigns();
  const isRound2Phase = phase === "round2";
  const isResultsPhase = phase === "results";

  // Fetch results if applicable
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
        {/* Show Round 1 results during round2 phase */}
        {isRound2Phase && round1Results && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Round 1 Results: Top 3 Finalists
            </h2>
            <ResultsDisplay
              finalistIds={round1Results.finalistIds}
              totalVoters={round1Results.totalVoters}
              allDesigns={designs}
              showFinalistsOnly={false}
            />
          </div>
        )}

        {/* Show final winner during results phase */}
        {isResultsPhase && round2Results && (
          <div className="mb-8">
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

        {/* SUB-05: Admin sees submitter names via isAdmin prop */}
        <h2 className="text-xl font-semibold mb-4">
          All Designs ({designs.length})
        </h2>
        <DesignGallery designs={designs} isAdmin={true} />

        {/* D-15: Delete All controls */}
        <AdminDesignControls designCount={designs.length} />
      </div>
    </div>
  );
}
