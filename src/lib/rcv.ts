export interface Ballot {
  firstChoice: number;
  secondChoice: number;
  thirdChoice: number;
}

export interface RCVRound {
  roundNumber: number;
  voteCounts: Record<number, number>;
  eliminated: number | null;
}

export interface RCVResult {
  finalists: number[];
  rounds: RCVRound[];
  totalVoters: number;
}

/**
 * Run weighted points elimination to select N finalists from ranked ballots.
 *
 * Algorithm:
 * 1. Get all unique candidates from ballots
 * 2. While remaining > targetFinalists:
 *    a. Calculate weighted points for remaining candidates (3 pts 1st, 2 pts 2nd, 1 pt 3rd)
 *    b. Find candidate(s) with fewest points
 *    c. If only one candidate has the minimum, eliminate them
 *    d. If multiple tied at minimum, keep all (don't eliminate anyone)
 *    e. Record round data
 * 3. Return finalists, rounds, totalVoters
 *
 * Ties result in keeping all tied candidates (may have more than targetFinalists).
 */
export function runRCV(ballots: Ballot[], targetFinalists: number): RCVResult {
  const rounds: RCVRound[] = [];
  const remainingCandidates = new Set<number>();

  // Get all unique candidates from ballots
  for (const ballot of ballots) {
    remainingCandidates.add(ballot.firstChoice);
    remainingCandidates.add(ballot.secondChoice);
    remainingCandidates.add(ballot.thirdChoice);
  }

  // Edge case: if we already have fewer or equal candidates than target, return all
  if (remainingCandidates.size <= targetFinalists) {
    return {
      finalists: Array.from(remainingCandidates).sort((a, b) => a - b),
      rounds: [],
      totalVoters: ballots.length,
    };
  }

  let maxIterations = remainingCandidates.size; // Prevent infinite loops
  while (remainingCandidates.size > targetFinalists && maxIterations > 0) {
    maxIterations--;

    // Calculate weighted points for remaining candidates
    // 3 points for 1st choice, 2 for 2nd, 1 for 3rd
    const pointCounts: Record<number, number> = {};
    for (const candidate of remainingCandidates) {
      pointCounts[candidate] = 0;
    }

    for (const ballot of ballots) {
      if (remainingCandidates.has(ballot.firstChoice)) {
        pointCounts[ballot.firstChoice] += 3;
      }
      if (remainingCandidates.has(ballot.secondChoice)) {
        pointCounts[ballot.secondChoice] += 2;
      }
      if (remainingCandidates.has(ballot.thirdChoice)) {
        pointCounts[ballot.thirdChoice] += 1;
      }
    }

    // Find minimum points
    const minPoints = Math.min(...Object.values(pointCounts));

    // Find all candidates with the minimum points
    const candidatesWithMinPoints = Array.from(remainingCandidates).filter(
      (c) => pointCounts[c] === minPoints
    );

    let eliminated: number | null = null;

    // Only eliminate if exactly one candidate has the minimum (no tie)
    if (candidatesWithMinPoints.length === 1) {
      eliminated = candidatesWithMinPoints[0];
      remainingCandidates.delete(eliminated);
    }
    // If there's a tie at the bottom, don't eliminate anyone - keep all tied candidates

    rounds.push({
      roundNumber: rounds.length + 1,
      voteCounts: { ...pointCounts }, // Now stores points, not first-choice counts
      eliminated,
    });

    // If we couldn't eliminate anyone (tie), stop the loop
    if (eliminated === null) {
      break;
    }
  }

  return {
    finalists: Array.from(remainingCandidates).sort((a, b) => a - b),
    rounds,
    totalVoters: ballots.length,
  };
}
