import Link from "next/link";
import { PhaseHero } from "@/components/phase-hero";
import { DesignUploadClient } from "@/components/design-upload-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getPhase } from "@/lib/phase";
import { getDesigns } from "@/lib/designs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const phase = await getPhase();
  const designs = await getDesigns();

  // Only allow access during submit phase
  if (phase !== "submit") {
    redirect("/");
  }

  return (
    <div>
      <PhaseHero />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>

        <DesignUploadClient totalDesigns={designs} />
      </div>
    </div>
  );
}
