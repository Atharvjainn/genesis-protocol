import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TEAMS = [
 "Re_Core","Hackers","Mafia_coders","Bugged_Out","Rehman_Parry","BruteForce","Syntax_Killers","CodeX","COD-i",
 "Alpha","Coffee_Overflow","INNOV8ORS","temp","CodeBlooded","BiasGuard","Pied_Piper","VisionX",
 "Oops_-404","IdeaForge","Ai_Avengers","Code_Bandits","Rasmalai","TEAM_VAAAS","Shahi_Tukda",
 "Trial","aultest"
];

export function useGithubCommits() {
  const lastShaMap = useRef<Record<string, string>>({});
  const queueRef = useRef<any[]>([]);
  const isToastingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 NEW: leaderboard state
  const [leaderboard, setLeaderboard] = useState<Record<string, number>>({});

  useEffect(() => {
    const showNextToast = () => {
      if (isToastingRef.current || queueRef.current.length === 0) return;

      isToastingRef.current = true;
      const item = queueRef.current.shift();

      toast("🚀 New push detected", {
        description:
          `📦 ${item.repo}\n` +
          `👤 ${item.author}\n\n` +
          `💬 ${item.message}\n\n` +
          `— — —\n` +
          `📊 Total commits: ${item.total}`,
        duration: 4500,
        onDismiss: () => {
          isToastingRef.current = false;
          showNextToast();
        },
        onAutoClose: () => {
          isToastingRef.current = false;
          showNextToast();
        },
      });
    };

    const poll = async () => {
      for (const repo of TEAMS) {
        try {
          const res = await fetch(`/api/commits?repo=${repo}`);
          if (!res.ok) continue;

          const data = await res.json();
          const lastSha = lastShaMap.current[repo];

          // 🆕 FIRST LOAD → store SHA + init leaderboard
          if (!lastSha) {
            lastShaMap.current[repo] = data.sha;
            setLeaderboard(prev => ({
              ...prev,
              [repo]: data.totalCommits,
            }));
            continue;
          }

          // 🚀 NEW COMMIT
          if (data.sha !== lastSha) {
            lastShaMap.current[repo] = data.sha;

            // 🔥 update leaderboard live
            setLeaderboard(prev => ({
              ...prev,
              [repo]: data.totalCommits,
            }));

            queueRef.current.push({
              repo,
              author: data.author,
              message: data.message,
              total: data.totalCommits,
            });

            showNextToast();
          }
        } catch (err) {
          console.error("❌ Polling error for", repo, err);
        }
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 50000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 🔥 RETURN LEADERBOARD FOR UI
  return { leaderboard };
}
