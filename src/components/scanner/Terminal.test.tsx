import { render, screen } from "@testing-library/react";
import { Terminal } from "./Terminal";
import { ScannerContext } from "@/context/ScannerContext";
import type { ScanState, ProgressEvent } from "@/lib/types";

const baseState: ScanState = {
  status: "idle",
  username: "",
  provider: "github",
  events: [],
  repos: {},
  wsConnected: false,
};

function renderWithContext(state: ScanState) {
  return render(
    <ScannerContext.Provider value={{ state, scan: jest.fn(), reset: jest.fn() }}>
      <Terminal />
    </ScannerContext.Provider>
  );
}

describe("Terminal", () => {
  it("renders waiting message when no events", () => {
    renderWithContext(baseState);
    expect(screen.getByText("Waiting for scan events...")).toBeInTheDocument();
  });

  it("renders events from state", () => {
    const events: ProgressEvent[] = [
      { type: "scan_start", message: "Scan started", repo: undefined },
      { type: "finding_found", message: "Secret found", repo: "my-repo" },
    ];
    renderWithContext({ ...baseState, events });
    expect(screen.getByText("Scan started")).toBeInTheDocument();
    expect(screen.getByText("Secret found")).toBeInTheDocument();
    expect(screen.getByText("[my-repo]", { exact: false })).toBeInTheDocument();
  });

  it("shows disconnected status dot when wsConnected is false", () => {
    renderWithContext(baseState);
    expect(screen.getByText("disconnected")).toBeInTheDocument();
    expect(screen.getByTestId("ws-dot")).toHaveStyle({ backgroundColor: "#444" });
  });

  it("shows connected status when wsConnected is true", () => {
    renderWithContext({ ...baseState, wsConnected: true });
    expect(screen.getByText("connected")).toBeInTheDocument();
  });
});
