import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReCircuit — The Amazon of E-Waste | AI Scan-to-Price Marketplace",
  description:
    "Domain-intelligent marketplace for e-waste, repair parts, and scrap recovery. AI Scan-to-Price gives instant defensible price ranges, condition grading, and escrow protection.",
  keywords: ["e-waste", "electronics recycling", "scrap copper", "laptop parts", "PCB scrap", "escrow"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base text-ink-primary antialiased relative selection:bg-copper/20 selection:text-copper-dark">
        {/* Ambient liquid glass backdrop blobs */}
        <div className="ambient-background">
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
          <div className="ambient-blob-3" />
        </div>

        {/* Global circuit-grid watermark */}
        <div className="fixed inset-0 circuit-grid pointer-events-none z-[-1] opacity-70" />

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
