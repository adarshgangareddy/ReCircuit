"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cpu,
  Scan,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Package,
  Handshake,
  Search,
  ExternalLink,
} from "lucide-react";
import { useReCircuitStore } from "@/lib/store";

interface NavbarProps {
  onOpenScanner?: () => void;
}

export function Navbar({ onOpenScanner }: NavbarProps) {
  const pathname = usePathname();
  const { currentUser, switchUser, allUsers, orders, offers } = useReCircuitStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");
  const pendingOrdersCount = orders.filter(
    (o) => o.buyerId === currentUser.id || o.sellerId === currentUser.id
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto glass-panel rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-glass">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-copper via-copper-hover to-sage flex items-center justify-center shadow-md shadow-copper/20 group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-ink-primary">
                Re<span className="text-copper">Circuit</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-sage/20 text-sage-dark border border-sage/30">
                E-Waste
              </span>
            </div>
            <p className="text-[10px] text-ink-secondary hidden sm:block -mt-1">
              AI Scan-to-Price · Escrow Protected
            </p>
          </div>
        </Link>

        {/* Global Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-ink-secondary">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              pathname === "/"
                ? "bg-white text-ink-primary font-semibold shadow-sm"
                : "hover:text-ink-primary hover:bg-white/50"
            }`}
          >
            Marketplace
          </Link>
          <Link
            href="/#categories"
            className="px-3.5 py-1.5 rounded-full transition-colors hover:text-ink-primary hover:bg-white/50"
          >
            Categories
          </Link>
          <Link
            href="/#scrap-spot"
            className="px-3.5 py-1.5 rounded-full transition-colors hover:text-ink-primary hover:bg-white/50"
          >
            Metal Spot Rates
          </Link>
          <Link
            href="/admin"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isAdminRoute
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "text-amber-800 bg-amber-50/80 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-copper" />
            Admin Console
          </Link>
        </nav>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hero Scan-to-Price Button */}
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="btn-primary-pill text-xs sm:text-sm py-2 px-3.5 sm:px-4 flex items-center gap-1.5 shadow-md group"
              title="Publish in under 60 seconds with AI Scan"
            >
              <Scan className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Scan to Price</span>
              <span className="sm:hidden">Scan</span>
            </button>
          )}

          {/* User Persona Switcher (Allows testing Buyer, Seller, Admin roles smoothly) */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="glass-pill px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-ink-primary hover:border-copper/40"
              title="Click to switch persona (Buyer / Seller / Admin)"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                  currentUser.role === "admin"
                    ? "bg-gradient-to-r from-amber-600 to-copper"
                    : currentUser.id === "usr_seller_priya"
                    ? "bg-sage"
                    : "bg-copper"
                }`}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-[11px] font-semibold leading-tight">
                  {currentUser.name.split(" ")[0]}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-ink-secondary">
                  {currentUser.role === "admin" ? "Admin (2FA)" : "Verified"}
                </span>
              </div>
            </button>

            {/* Persona Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-2.5 shadow-glass-lg border border-white/90 z-50 animate-fadeIn">
                <div className="px-2.5 py-1.5 mb-1 border-b border-black/5">
                  <p className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider">
                    Switch Test Persona (RBAC)
                  </p>
                </div>
                <div className="space-y-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentUser.id === user.id
                          ? "bg-copper/10 text-copper-dark font-semibold border border-copper/20"
                          : "hover:bg-white/80 text-ink-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                            user.role === "admin"
                              ? "bg-amber-600"
                              : user.id === "usr_seller_priya"
                              ? "bg-sage"
                              : "bg-copper"
                          }`}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-[10px] text-ink-secondary">
                            {user.role === "admin" ? "Platform Administrator" : user.city}
                          </p>
                        </div>
                      </div>
                      {user.role === "admin" && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                          ADMIN
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-black/5 flex flex-col gap-1">
                  <Link
                    href="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="text-xs text-copper hover:text-copper-dark font-medium px-2 py-1 rounded flex items-center justify-between hover:bg-copper/5"
                  >
                    <span>Open Admin Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
