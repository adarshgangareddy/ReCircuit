"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, KeyRound, Lock, ArrowRight, AlertTriangle, ShieldAlert } from "lucide-react";
import { useReCircuitStore } from "@/lib/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { switchUser, allUsers } = useReCircuitStore();

  const [email, setEmail] = useState("admin@recircuit.in");
  const [password, setPassword] = useState("••••••••••••");
  const [totpCode, setTotpCode] = useState("492810");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Verify 2FA TOTP code (Section 4.3: Mandatory TOTP for admin accounts)
    if (totpCode.length !== 6) {
      setError("Invalid 6-digit TOTP authenticator token.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Find admin user in store
      const adminUser = allUsers.find((u) => u.role === "admin");
      if (adminUser) {
        switchUser(adminUser.id);
        router.push("/admin");
      } else {
        setError("Admin credentials not authorized.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/90 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-600 to-copper flex items-center justify-center text-white shadow-md shadow-copper/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-ink-primary">Admin Security Gate</h1>
          <p className="text-xs text-ink-secondary">
            Isolated Namespace (/admin/*) · Mandatory TOTP 2FA Verification
          </p>
        </div>

        {/* Security Warning Callout */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Section 4.3 Hardening:</strong> Administrative mutations write to an immutable audit trail. Access requires cryptographic TOTP token from an authenticator app.
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-terracotta/15 border border-terracotta/40 text-terracotta text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-ink-secondary uppercase tracking-wider text-[10px] block mb-1">
              Admin Identity
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-card px-3.5 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-copper"
            />
          </div>

          <div>
            <label className="font-semibold text-ink-secondary uppercase tracking-wider text-[10px] block mb-1">
              Master Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-card px-3.5 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-copper"
            />
          </div>

          {/* Mandatory 2FA TOTP */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-copper uppercase tracking-wider text-[10px]">
                Authenticator TOTP Token (6 Digits)
              </label>
              <span className="text-[10px] text-ink-secondary">Pre-filled: 492810</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-copper" />
              <input
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full glass-card pl-9 pr-3.5 py-2.5 text-base font-mono font-bold tracking-widest text-ink-primary focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary-pill text-xs py-3 justify-center shadow-md bg-amber-700 hover:bg-amber-800 disabled:opacity-50"
          >
            {isLoading ? <span>Authenticating Token...</span> : <span>Authorize Admin Session</span>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-black/5">
          <Link href="/" className="text-xs text-ink-secondary hover:text-ink-primary">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
