"use client";

import { Design } from "@/lib/designs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VoteSummaryProps {
  rankedDesigns: number[];
  designs: Design[];
  onSubmit: () => void;
  isSubmitting: boolean;
  hasVoted: boolean;
  round?: "round1" | "round2" | "round3";
  voterName: string;
  onNameChange: (name: string) => void;
}

export function VoteSummary({
  rankedDesigns,
  designs,
  onSubmit,
  isSubmitting,
  hasVoted,
  round = "round1",
  voterName,
  onNameChange,
}: VoteSummaryProps) {
  // Map design IDs to design numbers (1-indexed position in sorted list)
  const getDesignNumber = (designId: number) => {
    const sortedDesigns = [...designs].sort((a, b) => a.id - b.id);
    return sortedDesigns.findIndex((d) => d.id === designId) + 1;
  };

  if (rankedDesigns.length === 0 && !hasVoted) {
    return null;
  }

  const requiredSelections = round === "round1" ? 3 : 1;

  if (hasVoted) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center font-medium">
            {(round === "round2" || round === "round3") ? (
              <>You voted for Design #{getDesignNumber(rankedDesigns[0])}</>
            ) : (
              <>
                You voted for:{" "}
                {rankedDesigns.map((id, i) => (
                  <span key={id}>
                    #{i + 1} Design {getDesignNumber(id)}
                    {i < rankedDesigns.length - 1 ? ", " : ""}
                  </span>
                ))}
              </>
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  const isComplete = rankedDesigns.length === requiredSelections;
  const canSubmit = isComplete && voterName.trim().length > 0;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-medium">
              {(round === "round2" || round === "round3") ? (
                <>Your vote: Design #{getDesignNumber(rankedDesigns[0])}</>
              ) : (
                <>
                  Your vote:{" "}
                  {rankedDesigns.map((id, i) => (
                    <span key={id}>
                      #{i + 1} Design {getDesignNumber(id)}
                      {i < rankedDesigns.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {rankedDesigns.length < 3 && (
                    <span className="text-muted-foreground">
                      {" "}(select {3 - rankedDesigns.length} more)
                    </span>
                  )}
                </>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Once submitted, your vote cannot be changed.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Input
              type="text"
              placeholder="Your name"
              value={voterName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-40"
              disabled={isSubmitting}
            />
            <Button
              onClick={onSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
