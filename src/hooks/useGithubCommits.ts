import { useEffect, useRef } from "react";
import { toast } from "sonner";

const TEAMS = [
 "Testingrepo"
]; // repo names inside the org

export function useGithubCommits() {
  const lastShaMap = useRef<Record<string, string>>({});
  const queueRef = useRef<any[]>([]);
  const isToastingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 🔥 Store interval reference

  useEffect(() => {
    // console.log("🎯 useGithubCommits hook initialized at", new Date().toLocaleTimeString());

    const showNextToast = () => {
      if (isToastingRef.current || queueRef.current.length === 0) {
        console.log("📋 showNextToast skipped:", {
          isToasting: isToastingRef.current,
          queueLength: queueRef.current.length
        });
        return;
      }

      isToastingRef.current = true;
      const item = queueRef.current.shift();

      // console.log("🎉 SHOWING TOAST:", item);

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
      // console.log("🔄 Polling at", new Date().toLocaleTimeString());

      for (const repo of TEAMS) {
        try {
          // console.log(`📡 Fetching ${repo}...`);
          const res = await fetch(`/api/commits?repo=${repo}`);
          
          if (!res.ok) {
            // console.warn(`⚠️ Failed to fetch ${repo}:`, res.status);
            continue;
          }

          const data = await res.json();
          // console.log(`📦 Data for ${repo}:`, {
          //   sha: data.sha?.substring(0, 7),
          //   author: data.author,
          //   message: data.message?.substring(0, 30),
          //   total: data.totalCommits
          // });

          const lastSha = lastShaMap.current[repo];

          // first load → just store SHA
          if (!lastSha) {
            // console.log(`🆕 First detection for ${repo}, storing SHA:`, data.sha?.substring(0, 7));
            lastShaMap.current[repo] = data.sha;
            continue;
          }

          // console.log(`🔍 Comparing for ${repo}:`, {
          //   stored: lastSha.substring(0, 7),
          //   current: data.sha?.substring(0, 7),
          //   changed: data.sha !== lastSha
          // });

          // new commit detected
          if (data.sha !== lastSha) {
            // console.log(`🚀 NEW COMMIT DETECTED for ${repo}!`);
            // console.log(`   Old SHA: ${lastSha.substring(0, 7)}`);
            // console.log(`   New SHA: ${data.sha.substring(0, 7)}`);
            
            lastShaMap.current[repo] = data.sha;

            const toastItem = {
              repo,
              author: data.author,
              message: data.message,
              total: data.totalCommits,
            };

            queueRef.current.push(toastItem);
            // console.log("📥 Added to queue:", toastItem);
            // console.log("📊 Queue length:", queueRef.current.length);

            showNextToast();
          } else {
            // console.log(`✓ No changes for ${repo}`);
          }
        } catch (err) {
          console.error("❌ Polling error for", repo, err);
        }
      }

      // console.log("🏁 Poll complete\n");
    };

    // Initial poll
    // console.log("▶️ Starting initial poll...");
    poll();

    // Set up interval and store reference
    // console.log("⏰ Setting up 10-second interval...");
    intervalRef.current = setInterval(() => {
      // console.log("\n⏰ INTERVAL TRIGGERED");
      poll();
    }, 50000);

    // Cleanup function
    return () => {
      // console.log("🛑 CLEANUP: Clearing interval");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // 🔥 Empty deps - runs once on mount

  // 🔥 Add a second useEffect to verify the hook stays mounted
  useEffect(() => {
    // console.log("💚 useGithubCommits is MOUNTED");
    
    return () => {
      // console.log("💔 useGithubCommits is UNMOUNTING");
    };
  }, []);
}