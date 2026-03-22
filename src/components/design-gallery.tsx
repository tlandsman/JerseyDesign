"use client";

import { Design } from "@/lib/designs";
import { DesignCard } from "@/components/design-card";
import { DesignLightbox } from "@/components/design-lightbox";
import { useSubmitter } from "@/components/submitter-provider";

interface DesignGalleryProps {
  designs: Design[];
  isAdmin?: boolean;
}

export function DesignGallery({ designs, isAdmin = false }: DesignGalleryProps) {
  const { token, isLoaded } = useSubmitter();

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No designs submitted yet.</p>
        <p className="text-sm mt-1">Be the first to share your jersey idea!</p>
      </div>
    );
  }

  // Sort designs by ID ascending (oldest first) for consistent numbering
  const sortedDesigns = [...designs].sort((a, b) => a.id - b.id);

  return (
    <DesignLightbox>
      {/* D-05: Uniform grid layout */}
      {/* D-06: 3 designs per row on desktop, responsive on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDesigns.map((design, index) => (
          <DesignCard
            key={design.id}
            design={design}
            designNumber={index + 1}
            isAdmin={isAdmin}
            isOwnDesign={isLoaded && token === design.submitterToken}
          />
        ))}
      </div>
    </DesignLightbox>
  );
}
