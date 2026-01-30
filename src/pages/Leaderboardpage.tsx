"use client";

import { useCommitLeaderboard } from "@/hooks/useCommitLeaderboard";
import { Leaderboard } from "@/components/hackathon/LeaderBoard";

export default function Page() {
  const { leaderboard } = useCommitLeaderboard();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        🏆 Live Commit Leaderboard
      </h1>

      <Leaderboard data={leaderboard} />
    </main>
  );
}
