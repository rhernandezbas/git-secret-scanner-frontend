"use client";
import type { ScanResult } from "@/lib/types";

interface StatsBarProps {
  results: ScanResult[];
}

export function StatsBar({ results }: StatsBarProps) {
  const allFindings = results.flatMap(r => r.findings ?? []);
  const critical = allFindings.filter(f => f.severity === "critical").length;
  const repos = results.length;
  const lastScan = results.length > 0
    ? new Date(results[results.length - 1].scanned_at).toLocaleTimeString()
    : "—";

  const stats = [
    { label: "Total Findings", value: allFindings.length, color: "var(--text)" },
    { label: "Critical", value: critical, color: critical > 0 ? "var(--red)" : "var(--text)" },
    { label: "Repos Scanned", value: repos, color: "var(--cyan)" },
    { label: "Last Scan", value: lastScan, color: "var(--text-muted)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
      {stats.map(({ label, value, color }) => (
        <div key={label} style={{
          backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "12px 16px",
        }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            {label}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
