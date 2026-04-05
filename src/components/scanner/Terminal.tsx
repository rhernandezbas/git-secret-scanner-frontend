"use client";
import { useEffect, useRef } from "react";
import { useScannerContext } from "@/context/ScannerContext";
import { Badge } from "@/components/ui/Badge";
import type { EventType } from "@/lib/types";

function formatTime(): string {
  return new Date().toTimeString().slice(0, 8);
}

export function Terminal() {
  const { state } = useScannerContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.events.length]);

  return (
    <div style={{
      backgroundColor: "#050505",
      border: "1px solid var(--border)",
      borderRadius: "8px",
      height: "400px",
      overflowY: "auto",
      padding: "12px",
      fontFamily: "inherit",
      fontSize: "12px",
    }}>
      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          data-testid="ws-dot"
          style={{
            width: "8px", height: "8px", borderRadius: "50%",
            backgroundColor: state.wsConnected ? "var(--green)" : "#444",
            display: "inline-block",
          }}
        />
        <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
          {state.wsConnected ? "connected" : "disconnected"}
        </span>
      </div>

      {state.events.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          Waiting for scan events...
        </p>
      )}

      {state.events.map((event, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "4px", lineHeight: "1.4" }}>
          <span style={{ color: "var(--text-muted)", flexShrink: 0, fontSize: "11px" }}>
            {formatTime()}
          </span>
          <Badge variant={event.type as EventType}>
            {event.type.replace(/_/g, " ")}
          </Badge>
          <span style={{ color: "var(--text)", wordBreak: "break-word" }}>
            {event.repo && <span style={{ color: "var(--cyan)" }}>[{event.repo}] </span>}
            {event.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
