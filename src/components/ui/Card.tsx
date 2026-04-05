"use client";
import type { HTMLAttributes } from "react";

export function Card({ style, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "16px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
