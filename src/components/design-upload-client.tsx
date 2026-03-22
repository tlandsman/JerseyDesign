"use client";

import { DesignUpload } from "@/components/design-upload";
import { useSubmitter } from "@/components/submitter-provider";
import type { Design } from "@/lib/designs";

interface DesignUploadClientProps {
  totalDesigns: Design[];
}

export function DesignUploadClient({ totalDesigns }: DesignUploadClientProps) {
  const { token, isLoaded } = useSubmitter();

  if (!isLoaded) {
    return null;
  }

  // Count designs for this submitter based on token
  const myDesignCount = totalDesigns.filter(d => d.submitterToken === token).length;

  return <DesignUpload currentCount={myDesignCount} />;
}
