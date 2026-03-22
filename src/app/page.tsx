import { PhaseHero } from "@/components/phase-hero";
import { DesignUploadClient } from "@/components/design-upload-client";
import { DesignGallery } from "@/components/design-gallery";
import { VotingGalleryWrapper } from "@/components/voting-gallery-wrapper";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const phase = await getPhase();
  const designs = await getDesigns();
  const isSubmitPhase = phase === "submit";
  const isVotingPhase = phase === "round1" || phase === "round2";

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {isSubmitPhase && (
          <div className="mb-8">
            <DesignUploadClient totalDesigns={designs} />
          </div>
        )}

        {/* Voting UI during round1/round2 phases */}
        {isVotingPhase && designs.length > 0 && (
          <VotingGalleryWrapper
            designs={designs}
            round={phase as "round1" | "round2"}
          />
        )}

        {/* Submit phase: show design gallery */}
        {isSubmitPhase && designs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Submitted Designs</h2>
            <DesignGallery designs={designs} isAdmin={false} />
          </div>
        )}

        {/* Results phase will be handled in Plan 03 */}
      </div>
    </div>
  );
}
