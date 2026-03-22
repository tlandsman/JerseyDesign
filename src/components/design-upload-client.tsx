"use client";

import { useState } from "react";
import { DesignUpload } from "@/components/design-upload";
import { useSubmitter } from "@/components/submitter-provider";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import type { Design } from "@/lib/designs";

interface DesignUploadClientProps {
  totalDesigns: Design[];
}

export function DesignUploadClient({ totalDesigns }: DesignUploadClientProps) {
  const { token, isLoaded } = useSubmitter();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isLoaded) {
    return null;
  }

  // Count designs for this submitter based on token
  const myDesignCount = totalDesigns.filter(d => d.submitterToken === token).length;

  return (
    <div className="border rounded-lg bg-muted/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/80 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          <span className="font-semibold">Submit a Design</span>
          <span className="text-sm text-muted-foreground">
            ({myDesignCount}/3 submitted)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 pt-0">
          <DesignUpload currentCount={myDesignCount} />
        </div>
      )}
    </div>
  );
}
