"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  ChevronRight,
  Flame,
  Search,
} from "lucide-react";
import { useReCircuitStore } from "@/lib/store";
import { Listing, Order, AdminAction } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    listings,
    updateListingStatus,
    orders,
    resolveEscrowDispute,
    adminActions,
    overrideLogs,
  } = useReCircuitStore();

  const [activeTab, setActiveTab] = useState<"moderation" | "disputes" | "audit" | "pricing">("moderation");
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<Order | null>(
    orders.find((o) => o.escrowStatus === "frozen_dispute") || orders[0] || null
  );
  const [resolutionReason, setResolutionReason] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // If user is not admin, provide gate
  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-ink-primary">Admin Clearance Required</h1>
          <p className="text-xs text-ink-secondary">
            Your current persona ({currentUser.name}) is registered as a standard User. Switch persona in the top menu or authenticate via the admin login portal.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/admin/login" className="btn-primary-pill text-xs py-2 px-4 justify-center bg-amber-700">
              Proceed to /admin/login
            </Link>
            <Link href="/" className="text-xs text-ink-secondary hover:text-ink-primary">
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter queues
  const pendingModerationListings = listings.filter(
    (l) => l.status === "pending_review" || l.status === "flagged"
  );
  const disputedOrders = orders.filter((o) => o.escrowStatus === "frozen_dispute");

  // Moderation action
  const handleApproveListing = (listingId: string) => {
    updateListingStatus(listingId, "active", "Approved by admin after hazardous packaging verification.");
    setActionNotice(`Listing ${listingId} approved and is now active.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRejectListing = (listingId: string) => {
    updateListingStatus(listingId, "removed", "Rejected by admin: Inadequate safety packaging for hazardous items.");
    setActionNotice(`Listing ${listingId} removed from platform.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Dispute resolution action
  const handleResolveDispute = (decision: "release" | "refund") => {
    if (!selectedDisputeOrder) return;
    resolveEscrowDispute(
      selectedDisputeOrder.id,
      decision,
      resolutionReason || (decision === "release" ? "Hardware tested functional by seller" : "Buyer's defect report verified")
    );
    setActionNotice(
      `Dispute resolved: Escrow funds ${decision === "release" ? "released to seller" : "refunded to buyer"}.`
    );
    setResolutionReason("");
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-ink-primary">ReCircuit Operations</span>
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-ink-secondary">
                Logged in as: <strong className="text-ink-primary">{currentUser.name}</strong> (2FA Verified)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="btn-secondary-pill text-xs py-1.5 px-3.5 flex items-center gap-1.5"
            >
              <span>View Public Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5 text-ink-secondary" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Console */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* KPI Strip (Section 10: GMV, active listings, AI price acceptance rate) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary block">
              Platform Escrow Volume
            </span>
            <p className="text-2xl font-extrabold text-ink-primary mt-1">₹48,920</p>
            <p className="text-[11px] text-sage-dark mt-0.5">100% held in safe escrow</p>
          </div>

          <div className="glass-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary block">
              Active Listings
            </span>
            <p className="text-2xl font-extrabold text-ink-primary mt-1">{listings.length}</p>
            <p className="text-[11px] text-ink-secondary mt-0.5">Across 6 tech categories</p>
          </div>

          <div className="glass-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-copper block">
              AI Price Acceptance Rate
            </span>
            <p className="text-2xl font-extrabold text-copper mt-1">87.4%</p>
            <p className="text-[11px] text-ink-secondary mt-0.5">Sellers accept suggested range</p>
          </div>

          <div className="glass-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block">
              Pending Queue Tasks
            </span>
            <p className="text-2xl font-extrabold text-terracotta mt-1">
              {pendingModerationListings.length + disputedOrders.length}
            </p>
            <p className="text-[11px] text-ink-secondary mt-0.5">
              {pendingModerationListings.length} moderation · {disputedOrders.length} disputes
            </p>
          </div>
        </div>

        {actionNotice && (
          <div className="p-3 rounded-2xl bg-sage/20 border border-sage/40 text-sage-dark text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-black/5 pb-2 overflow-x-auto text-xs font-semibold">
          {[
            {
              id: "moderation",
              label: `Moderation Queue (${pendingModerationListings.length})`,
              icon: AlertTriangle,
            },
            {
              id: "disputes",
              label: `Dispute Resolution Console (${disputedOrders.length})`,
              icon: Scale,
            },
            {
              id: "audit",
              label: `Admin Audit Log (${adminActions.length})`,
              icon: FileText,
            },
            {
              id: "pricing",
              label: `AI Retraining Flywheel (${overrideLogs.length} Overrides)`,
              icon: Sparkles,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-700 text-white shadow-sm"
                    : "glass-pill text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MODERATION QUEUE (Section 10 & 5.2) */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-ink-primary">
                  Regulated Categories & Flagged Items Queue
                </h2>
                <p className="text-xs text-ink-secondary">
                  Hazardous e-waste (Lithium batteries, lead-glass CRTs) must be reviewed before public visibility.
                </p>
              </div>
            </div>

            {pendingModerationListings.length > 0 ? (
              <div className="space-y-3">
                {pendingModerationListings.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-terracotta"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-terracotta text-white">
                            {item.status.replace("_", " ")}
                          </span>
                          <span className="text-xs text-ink-secondary font-mono">{item.categoryName}</span>
                        </div>

                        <h3 className="font-bold text-sm text-ink-primary">{item.title}</h3>
                        <p className="text-xs text-ink-secondary line-clamp-1">{item.description}</p>

                        {item.scanResult?.hazardType && (
                          <p className="text-[11px] font-semibold text-terracotta flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Hazard Type: {item.scanResult.hazardType}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-black/5">
                      <button
                        onClick={() => handleRejectListing(item.id)}
                        className="btn-secondary-pill text-xs py-2 px-3 text-terracotta hover:bg-terracotta/10"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApproveListing(item.id)}
                        className="btn-primary-pill text-xs py-2 px-4 bg-sage hover:bg-sage-dark shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-ink-secondary space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-sage-dark opacity-60" />
                <h3 className="text-sm font-bold text-ink-primary">Moderation Queue is Clear</h3>
                <p className="text-xs">No pending hazardous or flagged listings awaiting admin review.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DISPUTE RESOLUTION CONSOLE (Section 10 & 8) */}
        {activeTab === "disputes" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-ink-primary">
                Escrow Dispute Resolution Console
              </h2>
              <p className="text-xs text-ink-secondary">
                Side-by-side inspection of hardware failure claims and escrow balance adjudication.
              </p>
            </div>

            {disputedOrders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* List of Disputes */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary block">
                    Frozen Escrow Orders
                  </span>
                  {disputedOrders.map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedDisputeOrder(ord)}
                      className={`w-full text-left p-3.5 rounded-2xl glass-card transition-all ${
                        selectedDisputeOrder?.id === ord.id
                          ? "border-2 border-amber-600 bg-white"
                          : "hover:bg-white/80"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-ink-primary line-clamp-1">{ord.listingTitle}</span>
                        <span className="font-extrabold text-terracotta">₹{ord.finalPrice}</span>
                      </div>
                      <p className="text-[11px] text-ink-secondary mt-1">
                        Buyer: {ord.buyerName} vs {ord.sellerName}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Dispute Adjudication View */}
                {selectedDisputeOrder && (
                  <div className="lg:col-span-8 glass-panel rounded-3xl p-6 shadow-glass border border-white/90 space-y-5">
                    <div className="flex items-start justify-between pb-3 border-b border-black/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-terracotta/20 text-terracotta border border-terracotta/30">
                          Escrow Frozen
                        </span>
                        <h3 className="text-base font-bold text-ink-primary mt-1.5">
                          {selectedDisputeOrder.listingTitle}
                        </h3>
                        <p className="text-xs text-ink-secondary">Order ID: {selectedDisputeOrder.id}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-ink-secondary block">Locked Escrow Payout</span>
                        <span className="text-2xl font-extrabold text-copper">
                          ₹{selectedDisputeOrder.finalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Claim Details */}
                    <div className="p-4 rounded-2xl bg-terracotta/5 border border-terracotta/20 space-y-2 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block">
                        Buyer Dispute Affidavit:
                      </span>
                      <p className="text-ink-primary leading-relaxed">
                        &quot;{selectedDisputeOrder.disputeReason || "Item arrived defective during 72-hour test window."}&quot;
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-ink-secondary">
                        <span>Buyer: <strong>{selectedDisputeOrder.buyerName}</strong></span>
                        <span>·</span>
                        <span>Seller: <strong>{selectedDisputeOrder.sellerName}</strong></span>
                        <span>·</span>
                        <span>Pickup Token: <strong className="font-mono">{selectedDisputeOrder.pickupCode}</strong></span>
                      </div>
                    </div>

                    {/* Adjudication Controls */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-ink-primary block">
                        Adjudication Rationale (Written to Audit Trail):
                      </label>
                      <textarea
                        rows={2}
                        value={resolutionReason}
                        onChange={(e) => setResolutionReason(e.target.value)}
                        placeholder="State technical verdict (e.g. Diagnostic photos confirm POST failure, issuing 100% refund)..."
                        className="w-full glass-card p-3 text-xs text-ink-primary focus:outline-none focus:border-amber-700"
                      />

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => handleResolveDispute("refund")}
                          className="btn-primary-pill text-xs py-2.5 px-5 bg-terracotta hover:bg-terracotta-hover shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund Buyer (₹{selectedDisputeOrder.finalPrice})</span>
                        </button>

                        <button
                          onClick={() => handleResolveDispute("release")}
                          className="btn-primary-pill text-xs py-2.5 px-5 bg-sage hover:bg-sage-dark shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Release Escrow to Seller</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-ink-secondary space-y-2">
                <ShieldCheck className="w-10 h-10 mx-auto text-sage-dark opacity-60" />
                <h3 className="text-sm font-bold text-ink-primary">Zero Active Escrow Disputes</h3>
                <p className="text-xs">All marketplace transactions completed smoothly within the 72-hour window.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN ACTIONS AUDIT TRAIL (Section 3 & 5.1) */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-ink-primary">
                Immutable Admin Actions Audit Log (`admin_actions`)
              </h2>
              <p className="text-xs text-ink-secondary">
                Section 3 design rule: Every admin mutation writes to this audit trail.
              </p>
            </div>

            <div className="glass-card overflow-hidden border border-black/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.03] text-[10px] font-bold uppercase text-ink-secondary border-b border-black/5">
                  <tr>
                    <th className="py-2.5 px-4">Action Type</th>
                    <th className="py-2.5 px-4">Target</th>
                    <th className="py-2.5 px-4">Admin Officer</th>
                    <th className="py-2.5 px-4">Legal Reason / Verdict</th>
                    <th className="py-2.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-mono text-[11px]">
                  {adminActions.map((act) => (
                    <tr key={act.id} className="hover:bg-white/50">
                      <td className="py-2.5 px-4 font-bold uppercase text-copper">
                        {act.actionType.replace("_", " ")}
                      </td>
                      <td className="py-2.5 px-4 text-ink-primary">
                        {act.targetType}: {act.targetTitle || act.targetId}
                      </td>
                      <td className="py-2.5 px-4 text-ink-secondary">{act.adminName}</td>
                      <td className="py-2.5 px-4 text-ink-primary max-w-xs truncate font-sans">
                        {act.reason}
                      </td>
                      <td className="py-2.5 px-4 text-right text-ink-secondary">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING MODEL OVERRIDES & RETRAINING FLYWHEEL (Section 6.2) */}
        {activeTab === "pricing" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-ink-primary">
                AI Price Flywheel & Override Signals
              </h2>
              <p className="text-xs text-ink-secondary">
                Section 6.2: Logs systematic seller overrides as signals to retrain the XGBoost pricing weights.
              </p>
            </div>

            {overrideLogs.length > 0 ? (
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/[0.03] text-[10px] font-bold uppercase text-ink-secondary border-b border-black/5">
                    <tr>
                      <th className="py-2 px-3">Device / Model</th>
                      <th className="py-2 px-3">AI Suggested Range</th>
                      <th className="py-2 px-3">Seller Asking Price</th>
                      <th className="py-2 px-3">Override Delta</th>
                      <th className="py-2 px-3 text-right">Logged At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-xs">
                    {overrideLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-ink-primary">
                          {log.brand} {log.model}
                        </td>
                        <td className="py-2.5 px-3 text-ink-secondary">
                          ₹{log.aiSuggestedMin} – ₹{log.aiSuggestedMax}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-ink-primary">
                          ₹{log.sellerAskingPrice}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-copper">
                          {log.delta > 0 ? `+₹${log.delta}` : `₹${log.delta}`}
                        </td>
                        <td className="py-2.5 px-3 text-right text-ink-secondary">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card p-10 text-center text-ink-secondary space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-copper opacity-60" />
                <h3 className="text-sm font-bold text-ink-primary">Zero Severe Price Deviations</h3>
                <p className="text-xs">
                  Sellers have accepted 87.4% of AI valuations within standard ±₹50 tolerances.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
