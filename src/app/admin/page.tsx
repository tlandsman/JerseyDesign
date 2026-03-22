import { PhaseHero } from "@/components/phase-hero";
import { DesignGallery } from "@/components/design-gallery";
import { AdminDesignControls } from "@/components/admin-design-controls";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const phase = await getPhase();
  const designs = await getDesigns();

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
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
