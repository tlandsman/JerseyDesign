"use client";

import { useState } from "react";
import { resetEverythingAction } from "@/actions/design-actions";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export function ResetButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await resetEverythingAction();
    setIsResetting(false);
    setShowConfirm(false);
  };

  if (!showConfirm) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
        className="w-full"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset Everything
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-md">
        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-orange-600">Reset everything?</p>
          <p className="text-muted-foreground mt-1">
            Deletes all designs, votes, and results.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowConfirm(false)}
          className="flex-1"
          disabled={isResetting}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={handleReset}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
          disabled={isResetting}
        >
          {isResetting ? "Resetting..." : "Yes, Reset"}
        </Button>
      </div>
    </div>
  );
}
