"use client";
import type { SelectHTMLAttributes } from "react";

export function Select({ style, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        color: "var(--text)",
        fontFamily: "inherit",
        fontSize: "13px",
        padding: "8px 12px",
        outline: "none",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
