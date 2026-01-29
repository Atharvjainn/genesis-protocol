import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const repo = req.query.repo;
  if (!repo) return res.status(400).json({ error: "repo required" });

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  const commitsRes = await fetch(
    `https://api.github.com/repos/${process.env.ORG_NAME}/${repo}/commits`,
    { headers }
  );
  const commits = await commitsRes.json();

  const countRes = await fetch(
    `https://api.github.com/repos/${process.env.ORG_NAME}/${repo}/commits?per_page=1`,
    { headers }
  );
  const link = countRes.headers.get("link");
  const total = link
    ? Number(link.match(/page=(\d+)>; rel="last"/)?.[1])
    : 1;

 res.json({
  sha: commits[0].sha,
  message: commits[0].commit.message.split("\n")[0],
  author:
    commits[0].commit.author?.name ??
    commits[0].author?.login ??
    "Unknown",
  totalCommits: total,
});

}
