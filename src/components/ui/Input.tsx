"use client";
import type { InputHTMLAttributes } from "react";

export function Input({ style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        color: "var(--text)",
        fontFamily: "inherit",
        fontSize: "13px",
        padding: "8px 12px",
        outline: "none",
        width: "100%",
        ...style,
      }}
      {...props}
    />
  );
}
