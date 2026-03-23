import Link from "next/link";
import { getAllVotes, getPointsForRound } from "@/lib/votes";
import { getDesigns } from "@/lib/designs";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VotesPage() {
  const votes = await getAllVotes();
  const designs = await getDesigns();
  const round1Points = await getPointsForRound("round1");
  const round2Points = await getPointsForRound("round2");

  // Create a map of design id to design number (sorted by id)
  const sortedDesigns = [...designs].sort((a, b) => a.id - b.id);
  const designNumberMap = new Map(
    sortedDesigns.map((d, index) => [d.id, index + 1])
  );

  // Create a map of voter token to submitter name
  const voterNameMap = new Map(
    designs.map((d) => [d.submitterToken, d.submitterName])
  );

  // Group votes by voter
  const votesByVoter = new Map<string, typeof votes>();
  for (const vote of votes) {
    const existing = votesByVoter.get(vote.voterToken) || [];
    existing.push(vote);
    votesByVoter.set(vote.voterToken, existing);
  }

  // Sort designs by points (highest first) for display
  const round1Standings = Object.entries(round1Points)
    .map(([designId, pts]) => ({
      designId: parseInt(designId),
      designNum: designNumberMap.get(parseInt(designId)) || 0,
      points: pts,
    }))
    .sort((a, b) => b.points - a.points);

  const round2Standings = Object.entries(round2Points)
    .map(([designId, pts]) => ({
      designId: parseInt(designId),
      designNum: designNumberMap.get(parseInt(designId)) || 0,
      points: pts,
    }))
    .sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <h1 className="text-2xl font-bold mb-6">Voting Record</h1>

      {votes.length === 0 ? (
        <p className="text-muted-foreground">No votes recorded yet.</p>
      ) : (
        <div className="space-y-8">
          <p className="text-muted-foreground">
            {votesByVoter.size} voter{votesByVoter.size !== 1 ? "s" : ""}, {votes.length} total vote{votes.length !== 1 ? "s" : ""}
          </p>

          {/* Round 1 Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-blue-600">
              Round 1 — Weighted Voting ({votes.filter(v => v.round === "round1").length} votes)
            </h2>
            {votes.filter(v => v.round === "round1").length === 0 ? (
              <p className="text-muted-foreground text-sm">No round 1 votes yet.</p>
            ) : (
              <>
                {/* Standings */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">Standings</h3>
                  <div className="space-y-1">
                    {round1Standings.map((standing, index) => (
                      <div key={standing.designId} className="flex justify-between items-center">
                        <span className={index === 0 ? "font-bold" : ""}>
                          {index + 1}. Design #{standing.designNum}
                        </span>
                        <span className={`font-mono ${index === 0 ? "font-bold" : ""}`}>
                          {standing.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Votes table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Voter</th>
                        <th className="text-center p-3 font-medium">1st (3 pts)</th>
                        <th className="text-center p-3 font-medium">2nd (2 pts)</th>
                        <th className="text-center p-3 font-medium">3rd (1 pt)</th>
                        <th className="text-left p-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votes.filter(v => v.round === "round1").map((vote) => {
                        const voterName = voterNameMap.get(vote.voterToken) || "Anonymous";
                        return (
                          <tr key={vote.id} className="border-t">
                            <td className="p-3">{voterName}</td>
                            <td className="p-3 text-center">#{designNumberMap.get(vote.firstChoice) || "?"}</td>
                            <td className="p-3 text-center">#{designNumberMap.get(vote.secondChoice) || "?"}</td>
                            <td className="p-3 text-center">#{designNumberMap.get(vote.thirdChoice) || "?"}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {vote.submittedAt.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Round 2 Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-green-600">
              Round 2 — Final Vote ({votes.filter(v => v.round === "round2").length} votes)
            </h2>
            {votes.filter(v => v.round === "round2").length === 0 ? (
              <p className="text-muted-foreground text-sm">No round 2 votes yet.</p>
            ) : (
              <>
                {/* Standings */}
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium mb-2">Standings</h3>
                  <div className="space-y-1">
                    {round2Standings.map((standing, index) => (
                      <div key={standing.designId} className="flex justify-between items-center">
                        <span className={index === 0 ? "font-bold" : ""}>
                          {index + 1}. Design #{standing.designNum}
                        </span>
                        <span className={`font-mono ${index === 0 ? "font-bold" : ""}`}>
                          {standing.points} vote{standing.points !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Votes table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Voter</th>
                        <th className="text-center p-3 font-medium">Vote</th>
                        <th className="text-left p-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votes.filter(v => v.round === "round2").map((vote) => {
                        const voterName = voterNameMap.get(vote.voterToken) || "Anonymous";
                        return (
                          <tr key={vote.id} className="border-t">
                            <td className="p-3">{voterName}</td>
                            <td className="p-3 text-center font-medium">#{designNumberMap.get(vote.firstChoice) || "?"}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {vote.submittedAt.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
