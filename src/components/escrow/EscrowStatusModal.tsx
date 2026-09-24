"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Lock,
  QrCode,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Order } from "@/lib/types";
import { useReCircuitStore } from "@/lib/store";

interface EscrowStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export function EscrowStatusModal({ isOpen, onClose, order }: EscrowStatusModalProps) {
  const { freezeEscrowDispute, currentUser } = useReCircuitStore();
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    freezeEscrowDispute(order.id, disputeReason);
    setFeedback("Escrow FROZEN. Payout halted. Ticket dispatched to Admin Dispute Console.");
    setShowDisputeForm(false);
  };

  const isFrozen = order.escrowStatus === "frozen_dispute";
  const isReleased = order.escrowStatus === "released";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-5 sm:p-7 shadow-glass-lg border border-white/90 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isFrozen
                  ? "bg-terracotta/20 text-terracotta"
                  : isReleased
                  ? "bg-sage/20 text-sage-dark"
                  : "bg-copper/20 text-copper"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-ink-primary">Escrow Vault Security</h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    isFrozen
                      ? "bg-terracotta/15 text-terracotta border border-terracotta/30"
                      : isReleased
                      ? "bg-sage/15 text-sage-dark border border-sage/30"
                      : "bg-copper/15 text-copper border border-copper/30"
                  }`}
                >
                  {isFrozen ? "FROZEN (Dispute)" : isReleased ? "FUNDS RELEASED" : "FUNDS SECURELY HELD"}
                </span>
              </div>
              <p className="text-xs text-ink-secondary">Order ID: {order.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-ink-secondary hover:text-ink-primary border border-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Summary Box */}
        <div className="glass-card p-4 space-y-3 bg-white/70">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Protected Transaction:</span>
            <span className="font-bold text-ink-primary">{order.listingTitle}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Escrow Amount:</span>
            <span className="font-bold text-copper text-base">₹{order.finalPrice}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Seller:</span>
            <span className="font-medium text-ink-primary">{order.sellerName}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Buyer:</span>
            <span className="font-medium text-ink-primary">{order.buyerName}</span>
          </div>
        </div>

        {/* Pickup Handshake Code */}
        <div className="glass-card p-4 flex items-center gap-4 bg-white/80 border-copper/20">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-black/5 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-8 h-8 text-ink-primary" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-ink-secondary tracking-wider">
              Verified Handshake Pickup Code
            </span>
            <p className="font-mono text-lg font-bold text-copper tracking-widest">{order.pickupCode}</p>
            <p className="text-[11px] text-ink-secondary">
              Provide this token to seller upon physical inspection of parts.
            </p>
          </div>
        </div>

        {/* 72-Hour Dispute Window */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
          <Clock className="w-4 h-4 flex-shrink-0 text-amber-700" />
          <p className="text-[11px]">
            <strong>72-Hour Testing Window Active:</strong> Buyer has 72 hours from physical receipt to test components (POST motherboard, measure DC voltage) before funds automatically disburse to seller.
          </p>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-terracotta/15 border border-terracotta/40 text-terracotta text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Dispute Trigger Area */}
        {!isFrozen && !isReleased && (
          <div className="pt-2">
            {!showDisputeForm ? (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDisputeForm(true)}
                  className="text-xs text-terracotta hover:text-terracotta-dark font-medium underline flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Item defective or not as described? Freeze Escrow</span>
                </button>

                <button
                  onClick={onClose}
                  className="btn-primary-pill text-xs py-2 px-5"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="glass-card p-4 space-y-3 bg-terracotta/5 border-terracotta/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-terracotta">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Open Escrow Dispute & Freeze Payout</span>
                </div>
                <p className="text-[11px] text-ink-secondary">
                  Please describe the specific hardware failure (e.g. motherboard does not POST, battery bloated, cable cut). Payout will be immediately frozen.
                </p>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe hardware issue..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full glass-card p-2 text-xs text-ink-primary focus:outline-none focus:border-terracotta"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDisputeForm(false)}
                    className="btn-secondary-pill text-xs py-1.5 px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-pill text-xs py-1.5 px-4 bg-terracotta hover:bg-terracotta-hover"
                  >
                    Confirm & Freeze Escrow
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
