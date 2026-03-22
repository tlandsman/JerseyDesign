"use client";

import { useState } from "react";
import { resetRoundAction, resetAllAction } from "@/actions/vote-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface ResetVotesControlsProps {
  currentRound: "round1" | "round2" | null;
  voteCount: number;
}

export function ResetVotesControls({ currentRound, voteCount }: ResetVotesControlsProps) {
  const [showRoundConfirm, setShowRoundConfirm] = useState(false);
  const [showAllConfirm, setShowAllConfirm] = useState(false);
  const [isResettingRound, setIsResettingRound] = useState(false);
  const [isResettingAll, setIsResettingAll] = useState(false);

  const handleResetRound = async () => {
    if (!currentRound) return;
    setIsResettingRound(true);
    await resetRoundAction(currentRound);
    setIsResettingRound(false);
    setShowRoundConfirm(false);
  };

  const handleResetAll = async () => {
    setIsResettingAll(true);
    await resetAllAction();
    setIsResettingAll(false);
    setShowAllConfirm(false);
  };

  // Hide if no votes exist and not in a voting round
  if (voteCount === 0 && !currentRound) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Vote Management
        </CardTitle>
        <CardDescription>
          {voteCount} vote{voteCount !== 1 ? "s" : ""} recorded
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Reset Round Button - only shown during voting phases */}
        {currentRound && (
          <>
            {!showRoundConfirm ? (
              <Button
                variant="outline"
                onClick={() => setShowRoundConfirm(true)}
                className="w-full"
              >
                Reset {currentRound === "round1" ? "Round 1" : "Round 2"} Votes
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-600">
                      Reset {currentRound === "round1" ? "Round 1" : "Round 2"} votes?
                    </p>
                    <p className="text-muted-foreground mt-1">
                      This will delete all votes for this round only.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRoundConfirm(false)}
                    className="flex-1"
                    disabled={isResettingRound}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleResetRound}
                    className="flex-1"
                    disabled={isResettingRound}
                  >
                    {isResettingRound ? "Resetting..." : "Yes, Reset Round"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reset All Button - always shown when there are votes */}
        {voteCount > 0 && (
          <>
            {!showAllConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowAllConfirm(true)}
                className="w-full"
              >
                Reset All Votes
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Delete ALL voting data?</p>
                    <p className="text-muted-foreground mt-1">
                      This will delete all votes and results from all rounds. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllConfirm(false)}
                    className="flex-1"
                    disabled={isResettingAll}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetAll}
                    className="flex-1"
                    disabled={isResettingAll}
                  >
                    {isResettingAll ? "Deleting..." : "Yes, Delete All"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
