"use client";
import type { Severity, EventType } from "@/lib/types";

type BadgeVariant = Severity | EventType | "github" | "gitlab" | "scanning" | "done" | "error" | "default";

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  critical:          { bg: "var(--red)",    color: "white" },
  high:              { bg: "var(--orange)", color: "white" },
  medium:            { bg: "var(--yellow)", color: "black" },
  low:               { bg: "var(--blue)",   color: "white" },
  scan_start:        { bg: "var(--blue)",   color: "white" },
  repo_start:        { bg: "var(--cyan)",   color: "black" },
  file_scanned:      { bg: "#2a2a2a",       color: "var(--text-muted)" },
  finding_found:     { bg: "var(--red)",    color: "white" },
  ai_analysis_start: { bg: "var(--purple)", color: "white" },
  ai_analysis_done:  { bg: "var(--purple)", color: "white" },
  repo_done:         { bg: "var(--green)",  color: "black" },
  scan_complete:     { bg: "var(--green)",  color: "black" },
  error:             { bg: "var(--red)",    color: "white" },
  github:            { bg: "#333",          color: "white" },
  gitlab:            { bg: "var(--orange)", color: "white" },
  scanning:          { bg: "var(--blue)",   color: "white" },
  done:              { bg: "var(--green)",  color: "black" },
  default:           { bg: "#333",          color: "var(--text)" },
};

export function Badge({ variant = "default", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  const { bg, color } = BADGE_COLORS[variant] ?? BADGE_COLORS.default;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      backgroundColor: bg,
      color,
      fontFamily: "inherit",
    }}>
      {children}
    </span>
  );
}
