import type { ProgressEvent, ScanState, RepoCardState } from "./types";

export type ScanAction =
  | { type: "SCAN_STARTED"; username: string; provider: string }
  | { type: "WS_CONNECTED" }
  | { type: "WS_DISCONNECTED" }
  | { type: "WS_EVENT"; event: ProgressEvent }
  | { type: "SCAN_COMPLETE" }
  | { type: "RESET" };

export const initialState: ScanState = {
  status: "idle",
  username: "",
  provider: "github",
  events: [],
  repos: {},
  wsConnected: false,
};

export function scannerReducer(state: ScanState, action: ScanAction): ScanState {
  switch (action.type) {
    case "SCAN_STARTED":
      return {
        ...initialState,
        status: "scanning",
        username: action.username,
        provider: action.provider,
      };

    case "WS_CONNECTED":
      return { ...state, wsConnected: true };

    case "WS_DISCONNECTED":
      return { ...state, wsConnected: false };

    case "SCAN_COMPLETE":
      return { ...state, status: "complete" };

    case "RESET":
      return initialState;

    case "WS_EVENT": {
      const { event } = action;
      const newState = {
        ...state,
        events: [...state.events, event].slice(-500), // cap at 500
      };

      if (!event.repo) return newState;

      const repoName = event.repo;
      const existing = state.repos[repoName];

      switch (event.type) {
        case "repo_start": {
          const newRepo: RepoCardState = {
            name: repoName,
            provider: state.provider,
            status: "scanning",
            findingsCount: 0,
          };
          return {
            ...newState,
            repos: { ...state.repos, [repoName]: newRepo },
          };
        }

        case "finding_found": {
          if (!existing) return newState;
          return {
            ...newState,
            repos: {
              ...state.repos,
              [repoName]: {
                ...existing,
                findingsCount: existing.findingsCount + 1,
              },
            },
          };
        }

        case "ai_analysis_done": {
          if (!existing) return newState;
          const report = event.payload as { score?: number; reason?: string } | undefined;
          return {
            ...newState,
            repos: {
              ...state.repos,
              [repoName]: {
                ...existing,
                aiScore: report?.score,
                aiReason: report?.reason,
              },
            },
          };
        }

        case "repo_done": {
          if (!existing) return newState;
          return {
            ...newState,
            repos: {
              ...state.repos,
              [repoName]: { ...existing, status: "done" },
            },
          };
        }

        case "error": {
          if (!existing) return newState;
          return {
            ...newState,
            repos: {
              ...state.repos,
              [repoName]: { ...existing, status: "error" },
            },
          };
        }

        default:
          return newState;
      }
    }

    default:
      return state;
  }
}
