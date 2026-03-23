"use client";

import { Design } from "@/lib/designs";
import { deleteDesignAction } from "@/actions/design-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PhotoView } from "react-photo-view";

interface DesignCardProps {
  design: Design;
  designNumber: number;
  isAdmin?: boolean;
  isOwnDesign?: boolean;
  round1Points?: number;
  round2Points?: number;
}

export function DesignCard({ design, designNumber, isAdmin = false, isOwnDesign = false, round1Points, round2Points }: DesignCardProps) {
  const handleDelete = async () => {
    if (confirm(`Delete Design #${designNumber}?`)) {
      await deleteDesignAction(design.id);
    }
  };

  return (
    <Card className="overflow-hidden group relative">
      {/* D-05: Uniform aspect ratio card */}
      <div className="aspect-[4/3] relative">
        {/* D-07: Click opens lightbox (PhotoView wraps the image) */}
        <PhotoView src={design.imageUrl}>
          <img
            src={design.imageUrl}
            alt={`Design #${designNumber}`}
            className="w-full h-full object-cover cursor-pointer"
          />
        </PhotoView>

        {/* D-11: Subtle indicator for own designs */}
        {isOwnDesign && (
          <Badge
            className="absolute top-2 left-2 bg-primary/90 text-primary-foreground"
          >
            Your design
          </Badge>
        )}

      </div>

      {/* Card info section */}
      <div className="p-3">
        {/* D-12: Image + submission number shown to regular users */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Design #{designNumber}</span>
          {(isAdmin || isOwnDesign) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* D-13: Submitter name visible on card for admin */}
        {isAdmin && (
          <div className="text-sm text-muted-foreground mt-1">
            by {design.submitterName}
          </div>
        )}

        {/* Vote scores for admin */}
        {isAdmin && (round1Points !== undefined || round2Points !== undefined) && (
          <div className="text-sm mt-2 flex gap-3">
            {round1Points !== undefined && (
              <span className="text-blue-600">R1: {round1Points} pts</span>
            )}
            {round2Points !== undefined && (
              <span className="text-green-600">R2: {round2Points} pts</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
