"use client";
import { useEffect } from "react";
import { useScannerContext } from "@/context/ScannerContext";
import { ScanForm } from "@/components/scanner/ScanForm";
import { Terminal } from "@/components/scanner/Terminal";
import { RepoCardList } from "@/components/scanner/RepoCardList";
import { FindingsTable } from "@/components/findings/FindingsTable";
import { StatsBar } from "@/components/findings/StatsBar";
import { useFindings } from "@/hooks/useFindings";

export default function Home() {
  const { state } = useScannerContext();
  const { results, allFindings, loading, reload } = useFindings();

  // Reload findings when scan completes
  useEffect(() => {
    if (state.status === "complete") {
      reload();
    }
  }, [state.status, reload]);

  // Load findings on mount
  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--green)", margin: 0 }}>
            ⚡ git-secret-scanner
          </h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Scan public repositories for exposed secrets, tokens and credentials
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{
            width: "8px", height: "8px", borderRadius: "50%", display: "inline-block",
            backgroundColor: state.wsConnected ? "var(--green)" : "var(--border)",
          }} />
          {state.wsConnected ? "connected" : "idle"}
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar results={results} />

      {/* Scan Form + Terminal */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "16px" }}>
        <div style={{
          backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "20px",
        }}>
          <h2 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: 0 }}>
            New Scan
          </h2>
          <ScanForm />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            Live Output
          </h2>
          <Terminal />
        </div>
      </div>

      {/* Repo Cards */}
      <RepoCardList />

      {/* Findings Table */}
      <div style={{
        backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "8px", padding: "20px",
      }}>
        <FindingsTable findings={allFindings} loading={loading} onReload={reload} />
      </div>
    </main>
  );
}
