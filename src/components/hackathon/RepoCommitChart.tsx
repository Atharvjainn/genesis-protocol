import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels
);

type CommitCounts = Record<string, number>;

export default function RepoCommitChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 50000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const repos = [
      "CodeBlooded",
      "Mafia_coders",
      "INNOV8ORS",
      "Hackers",
      "COD-i",
      "Coffee_Overflow",
      "CodeX",
      "BiasGuard",
      "Rasmalai",
      "Rehman_Parry",
      "Alpha",
      "Re_Core",
      "Oops_-404",
      "TEAM_VAAAS",
      "VisionX",
      "Ai_Avengers",
      "Bugged_Out",
      "Pied_Piper",
      "BruteForce",
      "IdeaForge",
      "Syntax_Killers",
      "Code_Bandits",
      "Shahi_Tukda",
    ];

    const res = await axios.post<{ commitCounts: CommitCounts }>(
      "https://backend-quasar.onrender.com/commit-count",
      { repos }
    );

    const sorted = Object.entries(res.data.commitCounts).sort(
      (a, b) => b[1] - a[1]
    );

    setChartData({
      labels: sorted.map(([repo]) => repo),
      datasets: [
        {
          data: sorted.map(([, count]) => count),
          backgroundColor: "#22c55e",
          borderRadius: 6,
          barThickness: 25,
        },
      ],
    });
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "32px auto",
        padding: "0 24px",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          fontSize: 22,
          fontWeight: 600,
          textAlign : "center"
        }}
      >
        Leaderboard
      </h2>

      {chartData && (
        <div
          style={{
            height: "calc(100vh - 120px)",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
          className="hide-scrollbar"
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}</style>
          <div style={{ height: chartData.labels.length * 38 }}>
            <Bar
              data={chartData}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false },
                  datalabels: {
                    color: "#ffffff",
                    anchor: "center",
                    align: "center",
                    formatter: (value: number) => value,
                    font: {
                      size: 16,
                      weight: "bold",
                      color: "#000000",
                    },
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: { display: false },
                    grid: { display: false },
                  },
                  y: {
                    grid: { display: false },
                    ticks: {
                      padding: 6,
                      font: {
                        size: 14,
                        weight: 500,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}