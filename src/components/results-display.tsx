"use client";

import { Design } from "@/lib/designs";
import { Card } from "@/components/ui/card";
import { DesignLightbox } from "@/components/design-lightbox";
import { PhotoView } from "react-photo-view";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsDisplayProps {
  finalistIds: number[];
  totalVoters: number;
  allDesigns: Design[];
  showFinalistsOnly?: boolean;
}

export function ResultsDisplay({
  finalistIds,
  totalVoters,
  allDesigns,
  showFinalistsOnly = false,
}: ResultsDisplayProps) {
  const [showEliminated, setShowEliminated] = useState(false);

  // Sort all designs by ID for consistent numbering
  const sortedDesigns = [...allDesigns].sort((a, b) => a.id - b.id);

  // Get design number (1-indexed)
  const getDesignNumber = (designId: number) => {
    return sortedDesigns.findIndex((d) => d.id === designId) + 1;
  };

  // Separate finalists and eliminated
  const finalists = finalistIds
    .map((id) => allDesigns.find((d) => d.id === id))
    .filter((d): d is Design => d !== undefined);

  const eliminated = sortedDesigns.filter((d) => !finalistIds.includes(d.id));

  return (
    <div>
      {/* D-10: Simple summary */}
      <div className="text-center mb-6">
        <p className="text-lg text-muted-foreground">
          These {finalistIds.length} designs received the most support through ranked choice voting.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {totalVoters} team member{totalVoters !== 1 ? "s" : ""} voted in this round.
        </p>
      </div>

      {/* D-09: Finalists shown prominently */}
      <DesignLightbox>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {finalists.map((design, index) => (
            <Card key={design.id} className="overflow-hidden">
              <div className="aspect-[4/3] relative">
                <PhotoView src={design.imageUrl}>
                  <img
                    src={design.imageUrl}
                    alt={`Design #${getDesignNumber(design.id)}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </PhotoView>
              </div>
              <div className="p-4 text-center">
                <div className="text-lg font-semibold">
                  Design #{getDesignNumber(design.id)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Finalist #{index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DesignLightbox>

      {/* D-09: Eliminated designs shown smaller below or collapsed */}
      {!showFinalistsOnly && eliminated.length > 0 && (
        <div className="mt-8">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowEliminated(!showEliminated)}
          >
            {showEliminated ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide eliminated designs
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {eliminated.length} eliminated design{eliminated.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>

          {showEliminated && (
            <DesignLightbox>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                {eliminated.map((design) => (
                  <Card key={design.id} className="overflow-hidden opacity-60">
                    <div className="aspect-[4/3] relative">
                      <PhotoView src={design.imageUrl}>
                        <img
                          src={design.imageUrl}
                          alt={`Design #${getDesignNumber(design.id)}`}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      </PhotoView>
                    </div>
                    <div className="p-2 text-center">
                      <div className="text-sm font-medium">
                        Design #{getDesignNumber(design.id)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </DesignLightbox>
          )}
        </div>
      )}
    </div>
  );
}
