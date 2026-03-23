import { NextRequest, NextResponse } from "next/server";
import { hasVoted, getVoteForUser } from "@/lib/votes";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const round = request.nextUrl.searchParams.get("round") as "round1" | "round2" | "round3";

  if (!token || !round) {
    return NextResponse.json({ hasVoted: false });
  }

  const voted = await hasVoted(token, round);
  let vote = undefined;

  if (voted) {
    vote = await getVoteForUser(token, round);
  }

  return NextResponse.json({ hasVoted: voted, vote });
}
