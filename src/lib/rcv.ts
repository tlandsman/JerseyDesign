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
 * Run Ranked Choice Voting algorithm to select N finalists from ranked ballots.
 *
 * Algorithm:
 * 1. Get all unique candidates from ballots
 * 2. While remaining > targetFinalists:
 *    a. Count first-choice votes for remaining candidates
 *    b. Find candidate with fewest votes (tie-breaker: lower ID eliminated first)
 *    c. Eliminate that candidate
 *    d. Record round data
 * 3. Return finalists, rounds, totalVoters
 *
 * Handles exhausted ballots (skips ballot if no remaining valid choice).
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

  while (remainingCandidates.size > targetFinalists) {
    // Count first-choice votes for remaining candidates
    const voteCounts: Record<number, number> = {};
    for (const candidate of remainingCandidates) {
      voteCounts[candidate] = 0;
    }

    for (const ballot of ballots) {
      // Find highest-ranked remaining candidate (handles exhausted ballots)
      const choices = [ballot.firstChoice, ballot.secondChoice, ballot.thirdChoice];
      const validChoice = choices.find(c => remainingCandidates.has(c));
      if (validChoice !== undefined) {
        voteCounts[validChoice] = (voteCounts[validChoice] || 0) + 1;
      }
      // If no valid choice, ballot is exhausted - skip it
    }

    // Find candidate with fewest votes (tie-breaker: lower ID)
    let minVotes = Infinity;
    let eliminated: number | null = null;

    // Sort candidates by ID for deterministic tie-breaking
    const sortedCandidates = Array.from(remainingCandidates).sort((a, b) => a - b);

    for (const candidate of sortedCandidates) {
      const votes = voteCounts[candidate];
      if (votes < minVotes) {
        minVotes = votes;
        eliminated = candidate;
      }
    }

    rounds.push({
      roundNumber: rounds.length + 1,
      voteCounts: { ...voteCounts },
      eliminated,
    });

    if (eliminated !== null) {
      remainingCandidates.delete(eliminated);
    }
  }

  return {
    finalists: Array.from(remainingCandidates).sort((a, b) => a - b),
    rounds,
    totalVoters: ballots.length,
  };
}
