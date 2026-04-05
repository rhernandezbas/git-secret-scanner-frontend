import type { ScanRequest, ScanResult } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function startScan(req: ScanRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Scan failed (${res.status}): ${text}`);
  }
}

export async function getFindings(): Promise<ScanResult[]> {
  try {
    const res = await fetch(`${BASE_URL}/findings`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function createWebSocket(): WebSocket {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return new WebSocket(`${wsBase}/ws`);
}
