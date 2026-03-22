import { getPhase, getPhaseName } from "@/lib/phase";
import { Badge } from "@/components/ui/badge";

export async function PhaseIndicator() {
  const phase = await getPhase();
  const phaseName = getPhaseName(phase);

  return (
    <Badge variant="secondary" className="text-sm">
      {phaseName}
    </Badge>
  );
}
