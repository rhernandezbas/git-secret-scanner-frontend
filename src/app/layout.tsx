import type { Metadata } from "next";
import "./globals.css";
import { ScannerProvider } from "@/context/ScannerContext";

export const metadata: Metadata = {
  title: "git-secret-scanner",
  description: "Scan public repositories for exposed secrets and tokens",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <ScannerProvider>
          {children}
        </ScannerProvider>
      </body>
    </html>
  );
}
