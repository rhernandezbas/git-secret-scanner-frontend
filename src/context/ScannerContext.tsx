"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useScanner } from "@/hooks/useScanner";
import type { ScanState, ScanRequest } from "@/lib/types";

interface ScannerContextValue {
  state: ScanState;
  scan: (req: ScanRequest) => Promise<void>;
  reset: () => void;
}

export const ScannerContext = createContext<ScannerContextValue | null>(null);

export function ScannerProvider({ children }: { children: ReactNode }) {
  const scanner = useScanner();
  return (
    <ScannerContext.Provider value={scanner}>
      {children}
    </ScannerContext.Provider>
  );
}

export function useScannerContext(): ScannerContextValue {
  const ctx = useContext(ScannerContext);
  if (!ctx) throw new Error("useScannerContext must be used within ScannerProvider");
  return ctx;
}
