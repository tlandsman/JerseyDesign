import { PhaseHero } from "@/components/phase-hero";
import { DesignUploadClient } from "@/components/design-upload-client";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";

export const dynamic = "force-dynamic"; // Prevent caching phase state

export default async function Home() {
  const phase = await getPhase();
  const designs = await getDesigns();
  const isSubmitPhase = phase === "submit";

  return (
    <div>
      <PhaseHero />

      {isSubmitPhase && (
        <div className="px-4 pb-8">
          <DesignUploadClient totalDesigns={designs} />
        </div>
      )}

      {/* Phase 2 Plan 03 will add gallery here */}
    </div>
  );
}
