import { useRef, useState } from "react";

export function useCommitLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<Record<string, number>>({});
  const lastShaMap = useRef<Record<string, string>>({});

  const updateRepo = (repo: string, sha: string, totalCommits: number) => {
    const lastSha = lastShaMap.current[repo];

    if (!lastSha) {
      lastShaMap.current[repo] = sha;
      setLeaderboard(prev => ({
        ...prev,
        [repo]: totalCommits,
      }));
      return false;
    }

    if (sha !== lastSha) {
      lastShaMap.current[repo] = sha;
      setLeaderboard(prev => ({
        ...prev,
        [repo]: totalCommits,
      }));
      return true;
    }

    return false;
  };

  return { leaderboard, updateRepo };
}
