import Link from "next/link";
import { PhaseHero } from "@/components/phase-hero";
import { AdminControls } from "@/components/admin-controls";
import { DesignGallery } from "@/components/design-gallery";
import { ResultsDisplay } from "@/components/results-display";
import { WinnerDisplay } from "@/components/winner-display";
import { ResetButton } from "@/components/reset-button";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";
import { getResults, getPointsForRound, getVoteCountForRound } from "@/lib/votes";
import { ClipboardList } from "lucide-react";

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
  const round2Points = isResultsPhase
    ? await getPointsForRound("round2")
    : {};

  // Fetch points for admin view
  const round1Points = await getPointsForRound("round1");
  const allRound2Points = await getPointsForRound("round2");

  // Get vote counts
  const round1VoteCount = await getVoteCountForRound("round1");
  const round2VoteCount = await getVoteCountForRound("round2");
  const totalVoteCount = round1VoteCount + round2VoteCount;

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Admin Controls at top */}
        <div className="mb-8">
          <AdminControls />
        </div>

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
              points={round2Points}
            />
          </div>
        )}

        {/* SUB-05: Admin sees submitter names via isAdmin prop */}
        <h2 className="text-xl font-semibold mb-4">
          All Designs ({designs.length})
        </h2>
        <DesignGallery
          designs={designs}
          isAdmin={true}
          round1Points={round1Points}
          round2Points={allRound2Points}
        />

        {/* Voting Record Link */}
        <Link
          href="/admin/votes"
          className="mt-6 flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Voting Record</div>
              <div className="text-sm text-muted-foreground">
                {totalVoteCount} vote{totalVoteCount !== 1 ? "s" : ""} recorded
              </div>
            </div>
          </div>
          <span className="text-muted-foreground">View &rarr;</span>
        </Link>

        <div className="mt-8 pt-8 border-t">
          <ResetButton />
        </div>
      </div>
    </div>
  );
}
