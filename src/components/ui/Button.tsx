"use client";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, children, disabled, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    border: "1px solid",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.5 : 1,
    transition: "opacity 0.15s",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary:   { backgroundColor: "var(--green)",  borderColor: "var(--green)",  color: "black" },
    secondary: { backgroundColor: "transparent",    borderColor: "var(--border)", color: "var(--text)" },
    danger:    { backgroundColor: "var(--red)",     borderColor: "var(--red)",    color: "white" },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant], ...style }}
      {...props}
    >
      {loading ? "⟳ Loading..." : children}
    </button>
  );
}
