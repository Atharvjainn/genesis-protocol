import { useEffect, useRef } from "react";
import { toast } from "sonner";

const OWNER = "Atharvjainn";
const REPO = "genesis-protocol";

export function useGithubCommits() {
  const lastShaRef = useRef<string | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/commits`
        );

        if (!res.ok) return;

        const commits = await res.json();
        if (!Array.isArray(commits) || commits.length === 0) return;

        const latest = commits[0];

        // First load: store SHA, don't toast
        if (!lastShaRef.current) {
          lastShaRef.current = latest.sha;
          return;
        }

        if (latest.sha !== lastShaRef.current) {
          lastShaRef.current = latest.sha;

          const author =
            latest.commit.author?.name ??
            latest.author?.login ??
            "Unknown";

          const message =
            latest.commit.message
              .split("\n")[0]
              .slice(0, 80);

          toast("🚀 New push detected", {
            description: `${author} · ${message}`,
            duration: 4500,
          });
        }
      } catch (err) {
        console.error("GitHub polling failed", err);
      }
    };

    poll();
    const interval = setInterval(poll, 10000); // every 10s

    return () => clearInterval(interval);
  }, []);
}
