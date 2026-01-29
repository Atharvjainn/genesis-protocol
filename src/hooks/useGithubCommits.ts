import { useEffect, useRef } from "react";
import { toast } from "sonner";

const TEAMS = [
 "Testingrepo"
]; // repo names inside the org

export function useGithubCommits() {
  const lastShaMap = useRef<Record<string, string>>({});
  const queueRef = useRef<any[]>([]);
  const isToastingRef = useRef(false);

  useEffect(() => {
    const showNextToast = () => {
      if (isToastingRef.current || queueRef.current.length === 0) return;

      isToastingRef.current = true;
      const item = queueRef.current.shift();

      toast("🚀 New push detected", {
        description: `${item.repo} · ${item.author}\n${item.message}\nTotal commits: ${item.total}`,
        duration: 4500,
        onDismiss: () => {
          isToastingRef.current = false;
          showNextToast(); // show next toast
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

          // first load → just store SHA
          if (!lastSha) {
            lastShaMap.current[repo] = data.sha;
            continue;
          }

          // new commit
          if (data.sha !== lastSha) {
            lastShaMap.current[repo] = data.sha;

            queueRef.current.push({
              repo,
              author: data.author,
              message: data.message,
              total: data.totalCommits,
            });

            showNextToast();
          }
        } catch (err) {
          console.error("Polling failed for", repo, err);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, []);
}
