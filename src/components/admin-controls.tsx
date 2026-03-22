import { getPhase, getNextPhase, getPhaseName } from "@/lib/phase";
import { advancePhaseAction } from "@/actions/phase-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminControls() {
  const currentPhase = await getPhase();
  const nextPhase = getNextPhase(currentPhase);

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Admin Controls</CardTitle>
        <CardDescription>
          Current phase: {getPhaseName(currentPhase)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nextPhase ? (
          <form action={advancePhaseAction}>
            <Button type="submit" className="w-full">
              Advance to {getPhaseName(nextPhase)}
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
