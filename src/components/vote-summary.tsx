"use client";

import { Design } from "@/lib/designs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VoteSummaryProps {
  rankedDesigns: number[];
  designs: Design[];
  onSubmit: () => void;
  isSubmitting: boolean;
  hasVoted: boolean;
}

export function VoteSummary({
  rankedDesigns,
  designs,
  onSubmit,
  isSubmitting,
  hasVoted,
}: VoteSummaryProps) {
  // Map design IDs to design numbers (1-indexed position in sorted list)
  const getDesignNumber = (designId: number) => {
    const sortedDesigns = [...designs].sort((a, b) => a.id - b.id);
    return sortedDesigns.findIndex((d) => d.id === designId) + 1;
  };

  if (rankedDesigns.length === 0 && !hasVoted) {
    return null;
  }

  if (hasVoted) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center font-medium">
            You voted for:{" "}
            {rankedDesigns.map((id, i) => (
              <span key={id}>
                #{i + 1} Design {getDesignNumber(id)}
                {i < rankedDesigns.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </CardContent>
      </Card>
    );
  }

  const isComplete = rankedDesigns.length === 3;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-medium">
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
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Once submitted, your vote cannot be changed.
            </p>
          </div>
          <Button
            onClick={onSubmit}
            disabled={!isComplete || isSubmitting}
            className="shrink-0"
          >
            {isSubmitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
