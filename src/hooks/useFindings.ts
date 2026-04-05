"use client";
import { useState, useCallback } from "react";
import { getFindings } from "@/lib/api";
import type { ScanResult, Finding } from "@/lib/types";

interface UseFindingsResult {
  results: ScanResult[];
  allFindings: Finding[];
  loading: boolean;
  reload: () => Promise<void>;
}

export function useFindings(): UseFindingsResult {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFindings();
      setResults(data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const allFindings = results.flatMap(r => r.findings ?? []);

  return { results, allFindings, loading, reload };
}
