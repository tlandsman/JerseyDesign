import { PhaseHero } from "@/components/phase-hero";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div>
      <PhaseHero />
      {/* Same content as user page - admin sees what users see */}
      {/* AdminControls added via layout */}
    </div>
  );
}
