"use client";

import { useState } from "react";
import { deleteAllDesignsAction } from "@/actions/design-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, AlertTriangle } from "lucide-react";

interface AdminDesignControlsProps {
  designCount: number;
}

export function AdminDesignControls({ designCount }: AdminDesignControlsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    await deleteAllDesignsAction();
    setIsDeleting(false);
    setShowConfirm(false);
  };

  if (designCount === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Design Management
        </CardTitle>
        <CardDescription>
          {designCount} design{designCount !== 1 ? "s" : ""} submitted
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showConfirm ? (
          <Button
            variant="destructive"
            onClick={() => setShowConfirm(true)}
            className="w-full"
          >
            Delete All Designs
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Delete all {designCount} designs?</p>
                <p className="text-muted-foreground mt-1">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete All"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
