"use client";

import { Design } from "@/lib/designs";
import { Card } from "@/components/ui/card";
import { DesignLightbox } from "@/components/design-lightbox";
import { Confetti } from "@/components/confetti";
import { PhotoView } from "react-photo-view";
import { Trophy, AlertTriangle } from "lucide-react";

interface WinnerDisplayProps {
  winnerId: number;
  runnerUpIds: number[];
  totalVoters: number;
  allDesigns: Design[];
  points: Record<number, number>;
}

export function WinnerDisplay({
  winnerId,
  runnerUpIds,
  totalVoters,
  allDesigns,
  points,
}: WinnerDisplayProps) {
  // Sort all designs by ID for consistent numbering
  const sortedDesigns = [...allDesigns].sort((a, b) => a.id - b.id);

  // Get design number (1-indexed)
  const getDesignNumber = (designId: number) => {
    return sortedDesigns.findIndex((d) => d.id === designId) + 1;
  };

  const winner = allDesigns.find((d) => d.id === winnerId);
  const runnerUps = runnerUpIds
    .map((id) => allDesigns.find((d) => d.id === id))
    .filter((d): d is Design => d !== undefined);

  // Check for tie: does any runner-up have the same points as the winner?
  const winnerPoints = points[winnerId] || 0;
  const isTie = runnerUps.some((d) => (points[d.id] || 0) === winnerPoints);

  if (!winner) {
    return <div className="text-center text-muted-foreground">Winner not found</div>;
  }

  // Get all tied designs for tie display
  const tiedDesigns = isTie
    ? [winner, ...runnerUps.filter((d) => (points[d.id] || 0) === winnerPoints)].filter(
        (d): d is Design => d !== undefined
      )
    : [];

  if (isTie) {
    return (
      <div>
        {/* Tie warning */}
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Tie Detected!</span>
          </div>
          <p className="text-red-700 mt-1">
            A tie breaker voting round is needed to determine the winner.
          </p>
        </div>

        {/* Show tied designs */}
        <h3 className="text-lg font-semibold text-center mb-4">
          Tied Designs ({winnerPoints} vote{winnerPoints !== 1 ? "s" : ""} each)
        </h3>
        <DesignLightbox>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {tiedDesigns.map((design) => (
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
                <div className="p-3 text-center">
                  <div className="font-medium">Design #{getDesignNumber(design.id)}</div>
                  <div className="text-sm font-medium text-primary">
                    {points[design.id] || 0} vote{(points[design.id] || 0) !== 1 ? "s" : ""}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DesignLightbox>

        {/* Show non-tied runner-ups */}
        {runnerUps.filter((d) => (points[d.id] || 0) !== winnerPoints).length > 0 && (
          <div className="mt-8 border rounded-lg bg-muted/50 p-6">
            <h3 className="text-lg font-semibold text-center mb-4 text-muted-foreground">
              Other Finalists
            </h3>
            <DesignLightbox>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {runnerUps
                  .filter((d) => (points[d.id] || 0) !== winnerPoints)
                  .map((design) => (
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
                      <div className="p-3 text-center">
                        <div className="font-medium">Design #{getDesignNumber(design.id)}</div>
                        <div className="text-sm font-medium text-primary">
                          {points[design.id] || 0} vote{(points[design.id] || 0) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </DesignLightbox>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Confetti />
      {/* D-11: Hero winner card */}
      <div className="max-w-2xl mx-auto mb-8">
        <DesignLightbox>
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] relative">
              <PhotoView src={winner.imageUrl}>
                <img
                  src={winner.imageUrl}
                  alt={`Design #${getDesignNumber(winner.id)} - Winner`}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </PhotoView>
              {/* Trophy badge */}
              <div className="absolute top-4 left-4 bg-yellow-500 text-yellow-950 px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                <Trophy className="h-4 w-4" />
                Winner
              </div>
            </div>
            <div className="p-6 text-center">
              <div className="text-2xl font-bold">
                Design #{getDesignNumber(winner.id)}
              </div>
              <div className="text-xl font-semibold text-primary mt-1">
                {points[winner.id] || 0} vote{(points[winner.id] || 0) !== 1 ? "s" : ""}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                {totalVoters} voter{totalVoters !== 1 ? "s" : ""}
              </p>
            </div>
          </Card>
        </DesignLightbox>
      </div>

      {/* Standings */}
      {Object.keys(points).length > 0 && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-3 text-center">Final Standings</h3>
          <div className="space-y-2">
            {Object.entries(points)
              .map(([designId, pts]) => ({
                designId: parseInt(designId),
                designNum: getDesignNumber(parseInt(designId)),
                points: pts,
              }))
              .sort((a, b) => b.points - a.points)
              .map((standing, index) => (
                <div
                  key={standing.designId}
                  className={`flex justify-between items-center p-2 rounded ${
                    index === 0 ? "bg-yellow-100 font-bold" : ""
                  }`}
                >
                  <span>
                    {index + 1}. Design #{standing.designNum}
                    {index === 0 && " 🏆"}
                  </span>
                  <span className="font-mono">
                    {standing.points} pt{standing.points !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
