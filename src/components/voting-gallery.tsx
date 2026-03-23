"use client";

import { useState, useEffect } from "react";
import { Design } from "@/lib/designs";
import { Card } from "@/components/ui/card";
import { RankBadge } from "@/components/rank-badge";
import { VoteSummary } from "@/components/vote-summary";
import { DesignLightbox } from "@/components/design-lightbox";
import { useSubmitter } from "@/components/submitter-provider";
import { submitVoteAction } from "@/actions/vote-actions";
import { PhotoView } from "react-photo-view";
import { toast } from "sonner";

interface VotingGalleryProps {
  designs: Design[];
  round: "round1" | "round2";
  initialHasVoted: boolean;
  initialVote?: { firstChoice: number; secondChoice: number; thirdChoice: number };
  points?: Record<number, number>;
}

export function VotingGallery({
  designs,
  round,
  initialHasVoted,
  initialVote,
  points,
}: VotingGalleryProps) {
  const { token } = useSubmitter();
  const [rankedDesigns, setRankedDesigns] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with previous vote if exists
  useEffect(() => {
    if (initialVote && initialHasVoted) {
      setRankedDesigns([
        initialVote.firstChoice,
        initialVote.secondChoice,
        initialVote.thirdChoice,
      ]);
    }
  }, [initialVote, initialHasVoted]);

  // Max selections: 3 for round1, 1 for round2/round3
  const maxSelections = round === "round1" ? 3 : 1;

  // Per D-01: Tap to rank in sequence
  // Per D-03: Tap ranked design to unrank, remaining shift up
  const handleDesignClick = (designId: number) => {
    if (hasVoted) return;

    setRankedDesigns((prev) => {
      const existingIndex = prev.indexOf(designId);
      if (existingIndex !== -1) {
        // Already ranked - remove and shift others up (D-03)
        return prev.filter((id) => id !== designId);
      }
      if (prev.length >= maxSelections) {
        // Round 2: replace selection. Round 1: ignore if already have 3
        if (round === "round2") {
          return [designId];
        }
        return prev;
      }
      // Add as next rank
      return [...prev, designId];
    });
  };

  const getRank = (designId: number): number | null => {
    const index = rankedDesigns.indexOf(designId);
    return index === -1 ? null : index + 1;
  };

  // Per D-07: After submit, success toast, gallery stays visible but disabled
  const handleSubmit = async () => {
    const requiredSelections = round === "round1" ? 3 : 1;
    if (!token || rankedDesigns.length !== requiredSelections) return;

    setIsSubmitting(true);
    try {
      // For round 2, use the single choice for all fields
      const first = rankedDesigns[0];
      const second = round === "round1" ? rankedDesigns[1] : rankedDesigns[0];
      const third = round === "round1" ? rankedDesigns[2] : rankedDesigns[0];

      const result = await submitVoteAction(
        token,
        round,
        first,
        second,
        third
      );

      if (result.success) {
        toast.success("Vote submitted!");
        setHasVoted(true);
      } else {
        toast.error(result.error || "Failed to submit vote");
      }
    } catch {
      toast.error("Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort designs by ID for consistent numbering
  const sortedDesigns = [...designs].sort((a, b) => a.id - b.id);

  // Per D-04: Brief inline instruction above gallery
  const getInstructionText = () => {
    if (hasVoted) return "Your vote has been submitted.";
    if (round === "round2") {
      if (rankedDesigns.length === 0) {
        return "Tap to select the winning design";
      }
      return "Ready to submit your vote!";
    }
    // Round 1
    if (rankedDesigns.length === 0) return "Tap designs to rank your top 3 choices";
    if (rankedDesigns.length === 1) return "Tap 2 more designs to complete your ranking";
    if (rankedDesigns.length === 2) return "Tap 1 more design to complete your ranking";
    return "Ready to submit your vote!";
  };

  return (
    <div>
      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          {getInstructionText()}
        </p>
        {!hasVoted && rankedDesigns.length === 0 && round === "round1" && (
          <p className="text-sm text-muted-foreground mt-1">
            Votes are weighted: 1st choice = 3 pts, 2nd = 2 pts, 3rd = 1 pt
          </p>
        )}
      </div>

      {hasVoted ? (
        <DesignLightbox>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDesigns.map((design, index) => {
              const rank = getRank(design.id);
              const isRanked = rank !== null;

              return (
                <Card
                  key={design.id}
                  className={`overflow-hidden group relative cursor-default ${isRanked ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="aspect-[4/3] relative">
                    <PhotoView src={design.imageUrl}>
                      <img
                        src={design.imageUrl}
                        alt={`Design #${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </PhotoView>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Design #{index + 1}</span>
                      {points && (
                        <span className="text-sm text-muted-foreground">
                          ({points[design.id] || 0} pts)
                        </span>
                      )}
                    </div>
                    {isRanked && <RankBadge rank={rank} />}
                  </div>
                </Card>
              );
            })}
          </div>
        </DesignLightbox>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDesigns.map((design, index) => {
            const rank = getRank(design.id);
            const isRanked = rank !== null;

            return (
              <Card
                key={design.id}
                className={`overflow-hidden group relative cursor-pointer transition-all ${isRanked ? "ring-2 ring-primary" : ""}`}
                onClick={() => handleDesignClick(design.id)}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={design.imageUrl}
                    alt={`Design #${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Design #{index + 1}</span>
                    {points && (
                      <span className="text-sm text-muted-foreground">
                        ({points[design.id] || 0} pts)
                      </span>
                    )}
                  </div>
                  {isRanked && <RankBadge rank={rank} />}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <VoteSummary
        rankedDesigns={rankedDesigns}
        designs={designs}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        hasVoted={hasVoted}
        round={round}
      />
    </div>
  );
}
