"use client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { RepoCardState } from "@/lib/types";

interface RepoCardProps {
  repo: RepoCardState;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card style={{ minWidth: "200px", maxWidth: "240px", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span style={{ fontWeight: 600, fontSize: "13px", wordBreak: "break-word", flex: 1 }}>
          {repo.name}
        </span>
        <Badge variant={repo.status}>{repo.status}</Badge>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
        <Badge variant={repo.provider as "github" | "gitlab"}>{repo.provider}</Badge>
        {repo.findingsCount > 0 && (
          <Badge variant="critical">{repo.findingsCount} findings</Badge>
        )}
      </div>

      {repo.aiScore !== undefined && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>AI Score</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: repo.aiScore >= 7 ? "var(--green)" : repo.aiScore >= 4 ? "var(--yellow)" : "var(--red)" }}>
              {repo.aiScore}/10
            </span>
          </div>
          <div style={{ height: "4px", backgroundColor: "#222", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${repo.aiScore * 10}%`,
              backgroundColor: repo.aiScore >= 7 ? "var(--green)" : repo.aiScore >= 4 ? "var(--yellow)" : "var(--red)",
              transition: "width 0.5s",
            }} />
          </div>
          {repo.aiReason && (
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.4 }}>
              {repo.aiReason}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
