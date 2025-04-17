"use client";

import { useEffect, useState } from "react";
import { getAirtableStatistic } from "../api/statistic/airtable";
import { Statistic } from "../types/Statistic";

export default function Dashboard() {
  const [statistic, setStatistic] = useState<Statistic | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAirtableStatistic();
      if (data.length > 0) {
        setStatistic(data[0]); 
      }
    };

    fetchData();
  }, []);

  if (!statistic) {
    return <p>Loading dashboard...</p>;
  }

  const { TotalProject, TotalLike, TotalPublishedProject, TotalCategory, TotalStudent } = statistic.fields;

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>📊 Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
        <StatCard title="Total Projects" value={TotalProject} />
        <StatCard title="Published Projects" value={TotalPublishedProject} />
        <StatCard title="Total Likes" value={TotalLike} />
        <StatCard title="Categories" value={TotalCategory} />
        <StatCard title="Students" value={TotalStudent} />
      </div>
    </main>
  );
}

function StatCard({ title, value }: Readonly<{ title: string; value: number }>) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        background: "#fff",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{title}</h2>
      <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>{value}</p>
    </div>
  );
}
