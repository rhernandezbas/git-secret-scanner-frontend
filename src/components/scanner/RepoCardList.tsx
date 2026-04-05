"use client";
import { useScannerContext } from "@/context/ScannerContext";
import { RepoCard } from "./RepoCard";

export function RepoCardList() {
  const { state } = useScannerContext();
  const repos = Object.values(state.repos);

  if (repos.length === 0) return null;

  return (
    <div>
      <h2 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
        Repositories ({repos.length})
      </h2>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
        {repos.map(repo => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
}
