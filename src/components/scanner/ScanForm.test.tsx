import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ScanForm } from "./ScanForm";
import { ScannerContext } from "@/context/ScannerContext";
import type { ScanState } from "@/lib/types";

const idleState: ScanState = {
  status: "idle",
  username: "",
  provider: "github",
  events: [],
  repos: {},
  wsConnected: false,
};

const scanningState: ScanState = {
  ...idleState,
  status: "scanning",
};

function renderWithContext(state: ScanState, scan = jest.fn(), reset = jest.fn()) {
  return render(
    <ScannerContext.Provider value={{ state, scan, reset }}>
      <ScanForm />
    </ScannerContext.Provider>
  );
}

describe("ScanForm", () => {
  it("renders username input and provider select", () => {
    renderWithContext(idleState);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Provider")).toBeInTheDocument();
  });

  it("shows error and does not call scan when username is empty", async () => {
    const scan = jest.fn();
    renderWithContext(idleState, scan);
    fireEvent.click(screen.getByRole("button", { name: /start scan/i }));
    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });
    expect(scan).not.toHaveBeenCalled();
  });

  it("calls scan with correct args when username is valid", async () => {
    const scan = jest.fn();
    renderWithContext(idleState, scan);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "torvalds" } });
    fireEvent.click(screen.getByRole("button", { name: /start scan/i }));
    await waitFor(() => {
      expect(scan).toHaveBeenCalledWith({ username: "torvalds", provider: "github" });
    });
  });

  it("disables form inputs while scanning", () => {
    renderWithContext(scanningState);
    expect(screen.getByLabelText("Username")).toBeDisabled();
    expect(screen.getByLabelText("Provider")).toBeDisabled();
  });
});
