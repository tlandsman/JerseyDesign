import { getPhase, getNextPhase, getPhaseName } from "@/lib/phase";
import { getPointsForRound } from "@/lib/votes";
import { advancePhaseFormAction } from "@/actions/vote-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminControls() {
  const currentPhase = await getPhase();
  const nextPhase = getNextPhase(currentPhase);

  // Check if there's a tie in round2 to determine button text
  let buttonText = nextPhase ? `Advance to ${getPhaseName(nextPhase)}` : "";
  if (currentPhase === "round2") {
    const round2Points = await getPointsForRound("round2");
    const pointValues = Object.values(round2Points);
    const maxPoints = pointValues.length > 0 ? Math.max(...pointValues) : 0;
    const designsWithMaxPoints = pointValues.filter(p => p === maxPoints).length;
    const hasTie = designsWithMaxPoints > 1;
    buttonText = hasTie ? "Advance to Tie Breaker" : "Advance to Results";
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Admin Controls</CardTitle>
        <CardDescription>
          Current phase: {getPhaseName(currentPhase)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextPhase ? (
          <form action={advancePhaseFormAction}>
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Voting complete - no more phases
          </p>
        )}
      </CardContent>
    </Card>
  );
}
