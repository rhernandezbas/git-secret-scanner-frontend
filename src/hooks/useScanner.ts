"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";
import { scannerReducer, initialState } from "@/lib/scannerReducer";
import { startScan, createWebSocket } from "@/lib/api";
import type { ScanRequest, ProgressEvent } from "@/lib/types";

export function useScanner() {
  const [state, dispatch] = useReducer(scannerReducer, initialState);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWS = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = createWebSocket();
    wsRef.current = ws;

    ws.onopen = () => dispatch({ type: "WS_CONNECTED" });

    ws.onmessage = (e: MessageEvent) => {
      try {
        const event: ProgressEvent = JSON.parse(e.data);
        dispatch({ type: "WS_EVENT", event });
        if (event.type === "scan_complete") {
          dispatch({ type: "SCAN_COMPLETE" });
        }
      } catch {
        // ignore malformed events
      }
    };

    ws.onerror = () => dispatch({ type: "WS_DISCONNECTED" });
    ws.onclose = () => dispatch({ type: "WS_DISCONNECTED" });
  }, []);

  const scan = useCallback(
    async (req: ScanRequest) => {
      dispatch({ type: "SCAN_STARTED", username: req.username, provider: req.provider });
      connectWS();
      await startScan(req);
    },
    [connectWS]
  );

  const reset = useCallback(() => {
    wsRef.current?.close();
    dispatch({ type: "RESET" });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { state, scan, reset };
}
