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
        const commits = await res.json();

        if (!Array.isArray(commits) || commits.length === 0) return;

        const latest = commits[0];

        if (!lastShaRef.current) {
          lastShaRef.current = latest.sha;
          return;
        }

        if (latest.sha !== lastShaRef.current) {
          lastShaRef.current = latest.sha;

          const author =
            latest.commit.author?.name ?? "Someone";
          const message =
            latest.commit.message.split("\n")[0];

          toast(
            `🚀 ${author} pushed a commit`,
            {
              description: message,
              duration: 5000,
            }
          );
        }
      } catch (err) {
        console.error("GitHub commit polling failed", err);
      }
    };

    poll(); // initial
    const interval = setInterval(poll, 10000); // every 10s

    return () => clearInterval(interval);
  }, []);
}
