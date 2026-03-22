import { PhaseHero } from "@/components/phase-hero";

export const dynamic = "force-dynamic"; // Prevent caching phase state

export default function Home() {
  return (
    <div>
      <PhaseHero />
      {/* Phase 2 will add gallery/submission content here */}
      {/* Phase 3 will add voting interface here */}
    </div>
  );
}
