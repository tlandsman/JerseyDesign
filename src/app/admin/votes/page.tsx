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
                <div className="border rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Voter</th>
                        {sortedDesigns.map((design, index) => (
                          <th key={design.id} className="text-center p-3 font-medium whitespace-nowrap">
                            Design #{index + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {votes.filter(v => v.round === "round1").map((vote) => {
                        const voterName = vote.voterName;
                        return (
                          <tr key={vote.id} className="border-t">
                            <td className="p-3">{voterName}</td>
                            {sortedDesigns.map((design) => {
                              let rank = "";
                              if (vote.firstChoice === design.id) rank = "1st (3 pts)";
                              else if (vote.secondChoice === design.id) rank = "2nd (2 pts)";
                              else if (vote.thirdChoice === design.id) rank = "3rd (1 pt)";
                              return (
                                <td key={design.id} className="p-3 text-center text-sm whitespace-nowrap">
                                  {rank}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-blue-100 font-medium">
                      <tr className="border-t-2">
                        <td className="p-3">Total</td>
                        {sortedDesigns.map((design) => (
                          <td key={design.id} className="p-3 text-center">
                            {round1Points[design.id] || 0} pts
                          </td>
                        ))}
                      </tr>
                    </tfoot>
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
                <div className="border rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Voter</th>
                        {sortedDesigns.map((design, index) => (
                          <th key={design.id} className="text-center p-3 font-medium whitespace-nowrap">
                            Design #{index + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {votes.filter(v => v.round === "round2").map((vote) => {
                        const voterName = vote.voterName;
                        return (
                          <tr key={vote.id} className="border-t">
                            <td className="p-3">{voterName}</td>
                            {sortedDesigns.map((design) => (
                              <td key={design.id} className="p-3 text-center text-sm">
                                {vote.firstChoice === design.id ? "Vote (1 pt)" : ""}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-green-100 font-medium">
                      <tr className="border-t-2">
                        <td className="p-3">Total</td>
                        {sortedDesigns.map((design) => (
                          <td key={design.id} className="p-3 text-center">
                            {round2Points[design.id] || 0} pts
                          </td>
                        ))}
                      </tr>
                    </tfoot>
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
