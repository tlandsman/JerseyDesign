import { PhaseHero } from "@/components/phase-hero";
import { DesignUploadClient } from "@/components/design-upload-client";
import { DesignGallery } from "@/components/design-gallery";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const phase = await getPhase();
  const designs = await getDesigns();
  const isSubmitPhase = phase === "submit";

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {isSubmitPhase && (
          <div className="mb-8">
            <DesignUploadClient totalDesigns={designs} />
          </div>
        )}

        {/* SUB-02: Gallery visible in all phases */}
        {designs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isSubmitPhase ? "Submitted Designs" : "Designs"}
            </h2>
            <DesignGallery designs={designs} isAdmin={false} />
          </div>
        )}
      </div>
    </div>
  );
}
