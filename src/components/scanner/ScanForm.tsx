"use client";
import { useState } from "react";
import { useScannerContext } from "@/context/ScannerContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function ScanForm() {
  const { state, scan, reset } = useScannerContext();
  const [username, setUsername] = useState("");
  const [provider, setProvider] = useState<"github" | "gitlab">("github");
  const [error, setError] = useState("");

  const isScanning = state.status === "scanning";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setError("");
    await scan({ username: username.trim(), provider });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Username
        </label>
        <Input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="torvalds"
          disabled={isScanning}
          aria-label="Username"
        />
        {error && <p style={{ color: "var(--red)", fontSize: "12px", marginTop: "4px" }}>{error}</p>}
      </div>

      <div>
        <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Provider
        </label>
        <Select
          value={provider}
          onChange={e => setProvider(e.target.value as "github" | "gitlab")}
          disabled={isScanning}
          aria-label="Provider"
        >
          <option value="github">GitHub</option>
          <option value="gitlab">GitLab</option>
        </Select>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <Button type="submit" loading={isScanning} disabled={isScanning}>
          {isScanning ? "Scanning..." : "▶ Start Scan"}
        </Button>
        {state.status !== "idle" && (
          <Button type="button" variant="secondary" onClick={reset} disabled={isScanning}>
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}
