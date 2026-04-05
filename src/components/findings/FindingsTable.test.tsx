import { render, screen, fireEvent } from "@testing-library/react";
import { FindingsTable } from "./FindingsTable";
import type { Finding } from "@/lib/types";

const makeFinding = (overrides: Partial<Finding> = {}): Finding => ({
  id: "1",
  repo: "octocat/Hello-World",
  provider: "github",
  file_path: "src/config.js",
  line: 42,
  pattern_name: "AWS Access Key",
  category: "cloud",
  severity: "critical",
  match: "AKIAIOSFODNN7EXAMPLE",
  scanned_at: "2024-01-15T10:00:00Z",
  ...overrides,
});

describe("FindingsTable", () => {
  it("renders empty state when no findings", () => {
    render(<FindingsTable findings={[]} />);
    expect(screen.getByText(/no findings yet/i)).toBeInTheDocument();
  });

  it("renders rows when findings are present", () => {
    const findings = [
      makeFinding({ id: "1", repo: "org/repo-a", severity: "critical" }),
      makeFinding({ id: "2", repo: "org/repo-b", severity: "high" }),
    ];
    render(<FindingsTable findings={findings} />);
    expect(screen.getByText("org/repo-a")).toBeInTheDocument();
    expect(screen.getByText("org/repo-b")).toBeInTheDocument();
  });

  it("filters rows by repo search", () => {
    const findings = [
      makeFinding({ id: "1", repo: "org/alpha" }),
      makeFinding({ id: "2", repo: "org/beta" }),
    ];
    render(<FindingsTable findings={findings} />);
    const input = screen.getByPlaceholderText(/search repo/i);
    fireEvent.change(input, { target: { value: "alpha" } });
    expect(screen.getByText("org/alpha")).toBeInTheDocument();
    expect(screen.queryByText("org/beta")).not.toBeInTheDocument();
  });

  it("filters by severity when severity button toggled", () => {
    const findings = [
      makeFinding({ id: "1", repo: "org/repo-a", severity: "critical" }),
      makeFinding({ id: "2", repo: "org/repo-b", severity: "low" }),
    ];
    render(<FindingsTable findings={findings} />);
    // Click the "critical" severity filter button
    fireEvent.click(screen.getByRole("button", { name: /^critical$/i }));
    expect(screen.getByText("org/repo-a")).toBeInTheDocument();
    expect(screen.queryByText("org/repo-b")).not.toBeInTheDocument();
  });
});
