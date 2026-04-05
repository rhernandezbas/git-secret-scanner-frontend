export type EventType =
  | "scan_start"
  | "repo_start"
  | "file_scanned"
  | "finding_found"
  | "ai_analysis_start"
  | "ai_analysis_done"
  | "repo_done"
  | "scan_complete"
  | "error";

export type Severity = "critical" | "high" | "medium" | "low";

export interface ProgressEvent {
  type: EventType;
  repo?: string;
  message: string;
  payload?: unknown;
}

export interface Finding {
  id: string;
  repo: string;
  provider: string;
  file_path: string;
  line: number;
  pattern_name: string;
  category: string;
  severity: Severity;
  match: string;
  scanned_at: string;
}

export interface UtilityReport {
  repo: string;
  score: number;
  reason: string;
  model: string;
  provider: string;
  created_at: string;
}

export interface RepoInfo {
  name: string;
  full_name: string;
  description: string;
  clone_url: string;
  size_kb: number;
  language: string;
  stars: number;
  provider: string;
}

export interface ScanResult {
  repo: RepoInfo;
  findings: Finding[];
  utility_report?: UtilityReport;
  duration: string;
  scanned_at: string;
  error?: string;
}

export interface ScanRequest {
  username: string;
  provider: "github" | "gitlab";
}

export type RepoStatus = "scanning" | "done" | "error";

export interface RepoCardState {
  name: string;
  provider: string;
  status: RepoStatus;
  findingsCount: number;
  aiScore?: number;
  aiReason?: string;
}

export type ScanStatus = "idle" | "scanning" | "complete" | "error";

export interface ScanState {
  status: ScanStatus;
  username: string;
  provider: string;
  events: ProgressEvent[];
  repos: Record<string, RepoCardState>;
  wsConnected: boolean;
}
