import { scannerReducer, initialState, type ScanAction } from "./scannerReducer";
import type { ProgressEvent, ScanState } from "./types";

function makeEvent(type: ProgressEvent["type"], repo?: string, payload?: unknown): ProgressEvent {
  return { type, message: `msg:${type}`, repo, payload };
}

describe("scannerReducer", () => {
  test("1. SCAN_STARTED resets state and sets status=scanning", () => {
    const dirtyState: ScanState = {
      ...initialState,
      status: "complete",
      events: [makeEvent("scan_start")],
      repos: { myrepo: { name: "myrepo", provider: "github", status: "done", findingsCount: 3 } },
      wsConnected: true,
    };
    const next = scannerReducer(dirtyState, { type: "SCAN_STARTED", username: "alice", provider: "gitlab" });
    expect(next.status).toBe("scanning");
    expect(next.username).toBe("alice");
    expect(next.provider).toBe("gitlab");
    expect(next.events).toEqual([]);
    expect(next.repos).toEqual({});
    expect(next.wsConnected).toBe(false);
  });

  test("2. WS_CONNECTED sets wsConnected=true", () => {
    const next = scannerReducer(initialState, { type: "WS_CONNECTED" });
    expect(next.wsConnected).toBe(true);
  });

  test("3. WS_DISCONNECTED sets wsConnected=false", () => {
    const state = { ...initialState, wsConnected: true };
    const next = scannerReducer(state, { type: "WS_DISCONNECTED" });
    expect(next.wsConnected).toBe(false);
  });

  test("4. WS_EVENT repo_start adds repo card with status=scanning", () => {
    const state = { ...initialState, provider: "github" };
    const next = scannerReducer(state, {
      type: "WS_EVENT",
      event: makeEvent("repo_start", "myrepo"),
    });
    expect(next.repos["myrepo"]).toEqual({
      name: "myrepo",
      provider: "github",
      status: "scanning",
      findingsCount: 0,
    });
  });

  test("5. WS_EVENT finding_found increments findingsCount", () => {
    const state: ScanState = {
      ...initialState,
      repos: { myrepo: { name: "myrepo", provider: "github", status: "scanning", findingsCount: 2 } },
    };
    const next = scannerReducer(state, {
      type: "WS_EVENT",
      event: makeEvent("finding_found", "myrepo"),
    });
    expect(next.repos["myrepo"].findingsCount).toBe(3);
  });

  test("6. WS_EVENT ai_analysis_done sets aiScore and aiReason", () => {
    const state: ScanState = {
      ...initialState,
      repos: { myrepo: { name: "myrepo", provider: "github", status: "scanning", findingsCount: 0 } },
    };
    const next = scannerReducer(state, {
      type: "WS_EVENT",
      event: makeEvent("ai_analysis_done", "myrepo", { score: 8, reason: "high risk" }),
    });
    expect(next.repos["myrepo"].aiScore).toBe(8);
    expect(next.repos["myrepo"].aiReason).toBe("high risk");
  });

  test("7. WS_EVENT repo_done sets repo status=done", () => {
    const state: ScanState = {
      ...initialState,
      repos: { myrepo: { name: "myrepo", provider: "github", status: "scanning", findingsCount: 0 } },
    };
    const next = scannerReducer(state, {
      type: "WS_EVENT",
      event: makeEvent("repo_done", "myrepo"),
    });
    expect(next.repos["myrepo"].status).toBe("done");
  });

  test("8. WS_EVENT error sets repo status=error", () => {
    const state: ScanState = {
      ...initialState,
      repos: { myrepo: { name: "myrepo", provider: "github", status: "scanning", findingsCount: 0 } },
    };
    const next = scannerReducer(state, {
      type: "WS_EVENT",
      event: makeEvent("error", "myrepo"),
    });
    expect(next.repos["myrepo"].status).toBe("error");
  });

  test("9. SCAN_COMPLETE sets status=complete", () => {
    const state = { ...initialState, status: "scanning" as const };
    const next = scannerReducer(state, { type: "SCAN_COMPLETE" });
    expect(next.status).toBe("complete");
  });

  test("10. RESET returns initialState", () => {
    const dirty: ScanState = { ...initialState, status: "complete", username: "bob" };
    const next = scannerReducer(dirty, { type: "RESET" });
    expect(next).toEqual(initialState);
  });

  test("11. Events capped at 500", () => {
    let state = initialState;
    for (let i = 0; i < 501; i++) {
      state = scannerReducer(state, {
        type: "WS_EVENT",
        event: makeEvent("file_scanned"),
      });
    }
    expect(state.events.length).toBe(500);
  });

  test("12. Unknown event type with repo returns state + event appended", () => {
    const state: ScanState = {
      ...initialState,
      repos: { myrepo: { name: "myrepo", provider: "github", status: "scanning", findingsCount: 0 } },
    };
    const event = makeEvent("file_scanned", "myrepo");
    const next = scannerReducer(state, { type: "WS_EVENT", event });
    expect(next.events).toContainEqual(event);
    // repo state unchanged
    expect(next.repos["myrepo"]).toEqual(state.repos["myrepo"]);
  });
});
