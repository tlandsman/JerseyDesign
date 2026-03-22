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
}

export function DesignCard({ design, designNumber, isAdmin = false, isOwnDesign = false }: DesignCardProps) {
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

        {/* D-14: Individual delete button for admin */}
        {isAdmin && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Card info section */}
      <div className="p-3">
        {/* D-12: Image + submission number shown to regular users */}
        <div className="font-medium">Design #{designNumber}</div>

        {/* D-13: Submitter name visible on card for admin */}
        {isAdmin && (
          <div className="text-sm text-muted-foreground mt-1">
            by {design.submitterName}
          </div>
        )}
      </div>
    </Card>
  );
}
