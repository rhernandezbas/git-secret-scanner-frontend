"use client";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Finding, Severity } from "@/lib/types";

interface FindingsTableProps {
  findings: Finding[];
  loading?: boolean;
  onReload?: () => void;
}

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

export function FindingsTable({ findings, loading, onReload }: FindingsTableProps) {
  const [searchRepo, setSearchRepo] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Set<Severity>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    return findings.filter(f => {
      if (searchRepo && !f.repo.toLowerCase().includes(searchRepo.toLowerCase())) return false;
      if (severityFilter.size > 0 && !severityFilter.has(f.severity)) return false;
      if (categoryFilter && f.category !== categoryFilter) return false;
      return true;
    });
  }, [findings, searchRepo, severityFilter, categoryFilter]);

  const categories = useMemo(() => [...new Set(findings.map(f => f.category))].sort(), [findings]);

  const toggleSeverity = (s: Severity) => {
    setSeverityFilter(prev => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
          Findings ({filtered.length}{filtered.length !== findings.length ? ` / ${findings.length}` : ""})
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          {findings.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `findings-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              ↓ Download JSON
            </Button>
          )}
          <Button variant="secondary" onClick={onReload} loading={loading} style={{ fontSize: "11px", padding: "4px 10px" }}>
            ↻ Reload
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={searchRepo}
          onChange={e => setSearchRepo(e.target.value)}
          placeholder="Search repo..."
          style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "4px", color: "var(--text)", fontFamily: "inherit",
            fontSize: "12px", padding: "4px 8px", outline: "none",
          }}
        />
        {SEVERITIES.map(s => (
          <button
            key={s}
            onClick={() => toggleSeverity(s)}
            style={{
              padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600,
              textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
              border: severityFilter.has(s) ? "2px solid white" : "2px solid transparent",
              backgroundColor: { critical: "var(--red)", high: "var(--orange)", medium: "var(--yellow)", low: "var(--blue)" }[s],
              color: s === "medium" ? "black" : "white",
              opacity: severityFilter.size === 0 || severityFilter.has(s) ? 1 : 0.4,
            }}
          >
            {s}
          </button>
        ))}
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "4px", color: "var(--text)", fontFamily: "inherit",
              fontSize: "12px", padding: "4px 8px", outline: "none",
            }}
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Empty state */}
      {findings.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
          No findings yet. Run a scan.
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Repo", "File", "Line", "Pattern", "Category", "Severity", "Match", "Date"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id || i} style={{ borderBottom: "1px solid var(--border-subtle)", backgroundColor: i % 2 === 0 ? "transparent" : "var(--bg-card)" }}>
                  <td style={{ padding: "6px 8px", color: "var(--cyan)" }}>{f.repo}</td>
                  <td style={{ padding: "6px 8px", color: "var(--text-muted)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.file_path}</td>
                  <td style={{ padding: "6px 8px", color: "var(--text-muted)" }}>{f.line}</td>
                  <td style={{ padding: "6px 8px" }}>{f.pattern_name}</td>
                  <td style={{ padding: "6px 8px", color: "var(--text-muted)" }}>{f.category}</td>
                  <td style={{ padding: "6px 8px" }}><Badge variant={f.severity}>{f.severity}</Badge></td>
                  <td style={{ padding: "6px 8px", fontFamily: "monospace", color: "var(--amber)" }}>{f.match}</td>
                  <td style={{ padding: "6px 8px", color: "var(--text-dim)", whiteSpace: "nowrap" }}>{new Date(f.scanned_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
