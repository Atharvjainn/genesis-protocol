export function Leaderboard({ data }: { data: Record<string, number> }) {
  const sorted = Object.entries(data)
    .sort((a, b) => b[1] - a[1]);

  const max = Math.max(...sorted.map(([, v]) => v), 1);

  return (
    <div className="space-y-3">
      {sorted.map(([repo, count], index) => (
        <div key={repo}>
          <div className="flex justify-between text-sm mb-1">
            <span>#{index + 1} {repo}</span>
            <span>{count}</span>
          </div>

          <div className="h-3 bg-gray-200 rounded">
            <div
              className="h-3 bg-blue-500 rounded transition-all duration-500"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
