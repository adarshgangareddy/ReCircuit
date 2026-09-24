import React from "react";
import { Cpu, ShieldCheck, Recycle, Sparkles, Scale, AlertTriangle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-black/5 bg-white/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-copper tracking-tight">14,280 kg</p>
            <p className="text-xs text-ink-secondary mt-0.5">E-Waste Diverted from Landfills</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-sage-dark tracking-tight">890 kg</p>
            <p className="text-xs text-ink-secondary mt-0.5">Pure Copper Reclaimed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-ink-primary tracking-tight">&lt; 45 sec</p>
            <p className="text-xs text-ink-secondary mt-0.5">Median Scan-to-List Speed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-amber-700 tracking-tight">100%</p>
            <p className="text-xs text-ink-secondary mt-0.5">Escrow-Backed Dispute Protection</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-black/5 text-xs text-ink-secondary">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-copper" />
            </div>
            <span className="font-semibold text-ink-primary">ReCircuit Marketplace</span>
            <span>— The Domain-Intelligent E-Waste Ecosystem</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-sage-dark font-medium">
              <Recycle className="w-3.5 h-3.5" /> Certified Green Recyclers Network
            </span>
            <span className="flex items-center gap-1.5 text-copper font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 72-Hour Verification Escrow
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
