import { getPhase, getNextPhase, getPhaseName } from "@/lib/phase";
import { advancePhaseFormAction } from "@/actions/vote-actions";
import { getVoteCountForRound } from "@/lib/votes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetVotesControls } from "@/components/reset-votes-controls";

export async function AdminControls() {
  const currentPhase = await getPhase();
  const nextPhase = getNextPhase(currentPhase);

  // Get current round for reset controls (null if not in a voting phase)
  const currentRound: "round1" | "round2" | null =
    currentPhase === "round1" || currentPhase === "round2" ? currentPhase : null;

  // Get total vote count across both rounds
  const round1Votes = await getVoteCountForRound("round1");
  const round2Votes = await getVoteCountForRound("round2");
  const totalVotes = round1Votes + round2Votes;

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 max-h-[90vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Admin Controls</CardTitle>
        <CardDescription>
          Current phase: {getPhaseName(currentPhase)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextPhase ? (
          <form action={advancePhaseFormAction}>
            <Button type="submit" className="w-full">
              Advance to {getPhaseName(nextPhase)}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Voting complete - no more phases
          </p>
        )}

        {/* Reset controls - shown during voting phases or when there are votes */}
        {(currentRound || totalVotes > 0) && (
          <ResetVotesControls currentRound={currentRound} voteCount={totalVotes} />
        )}
      </CardContent>
    </Card>
  );
}
