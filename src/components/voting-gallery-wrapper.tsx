"use client";

import { useState, useEffect } from "react";
import { Design } from "@/lib/designs";
import { VotingGallery } from "@/components/voting-gallery";
import { useSubmitter } from "@/components/submitter-provider";

interface VotingGalleryWrapperProps {
  designs: Design[];
  round: "round1" | "round2" | "round3";
  points?: Record<number, number>;
}

export function VotingGalleryWrapper({ designs, round, points }: VotingGalleryWrapperProps) {
  const { token, isLoaded } = useSubmitter();
  const [hasVoted, setHasVoted] = useState(false);
  const [vote, setVote] = useState<{ firstChoice: number; secondChoice: number; thirdChoice: number } | undefined>();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkVoteStatus() {
      if (!token) return;

      try {
        const response = await fetch(`/api/vote-status?token=${token}&round=${round}`);
        const data = await response.json();
        setHasVoted(data.hasVoted);
        if (data.vote) {
          setVote(data.vote);
        }
      } catch (error) {
        console.error("Failed to check vote status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    if (isLoaded && token) {
      checkVoteStatus();
    } else if (isLoaded) {
      setIsChecking(false);
    }
  }, [token, round, isLoaded]);

  if (!isLoaded || isChecking) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <VotingGallery
      designs={designs}
      round={round}
      initialHasVoted={hasVoted}
      initialVote={vote}
      points={points}
    />
  );
}
