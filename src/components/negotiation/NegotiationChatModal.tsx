"use client";

import React, { useState } from "react";
import {
  X,
  Handshake,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Listing, Offer } from "@/lib/types";
import { useReCircuitStore } from "@/lib/store";

interface NegotiationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  existingOffer?: Offer;
  onOfferAccepted?: () => void;
}

export function NegotiationChatModal({
  isOpen,
  onClose,
  listing,
  existingOffer,
  onOfferAccepted,
}: NegotiationChatModalProps) {
  const { currentUser, createOffer, counterOffer, acceptOffer, offers } = useReCircuitStore();

  const currentThreadOffer =
    offers.find((o) => o.listingId === listing.id && (o.buyerId === currentUser.id || o.sellerId === currentUser.id)) ||
    existingOffer;

  const [offerAmount, setOfferAmount] = useState<number>(
    currentThreadOffer ? currentThreadOffer.counterAmount || currentThreadOffer.amount : Math.round(listing.askingPrice * 0.9)
  );
  const [chatMessage, setChatMessage] = useState("");
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSeller = currentUser.id === listing.sellerId;
  const roundCount = currentThreadOffer ? currentThreadOffer.roundCount : 0;
  const isRateLimited = roundCount >= 5;

  const handleMakeInitialOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount <= 0) return;

    createOffer(listing, offerAmount, chatMessage || "Interested in purchasing this item.");
    setStatusFeedback("Offer submitted! The seller has 48 hours to accept or counter.");
    setChatMessage("");
  };

  const handleCounter = () => {
    if (!currentThreadOffer || isRateLimited) return;
    counterOffer(currentThreadOffer.id, offerAmount, chatMessage || `Counter-offer: ₹${offerAmount}`);
    setStatusFeedback(`Counter-offer of ₹${offerAmount} transmitted.`);
    setChatMessage("");
  };

  const handleAccept = () => {
    if (!currentThreadOffer) return;
    acceptOffer(currentThreadOffer.id);
    setStatusFeedback("Offer Accepted! Escrow locked. Proceeding to verified pickup.");
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#7A8B6F", "#B8703F"],
      });
    } catch {
      // ignore
    }
    if (onOfferAccepted) {
      setTimeout(() => {
        onOfferAccepted();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-5 sm:p-6 shadow-glass-lg border border-white/90 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-copper/15 flex items-center justify-center text-copper">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-ink-primary">Live Negotiation Thread</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-copper/10 text-copper border border-copper/20">
                  Immutable Audit State
                </span>
              </div>
              <p className="text-xs text-ink-secondary line-clamp-1">{listing.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-ink-secondary hover:text-ink-primary border border-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Context Ribbon */}
        <div className="my-3 p-3 rounded-2xl glass-card flex items-center justify-between text-xs bg-white/50">
          <div>
            <span className="text-ink-secondary block text-[10px] uppercase tracking-wider font-semibold">
              Asking Price
            </span>
            <span className="font-bold text-ink-primary text-sm">₹{listing.askingPrice}</span>
          </div>

          <div>
            <span className="text-ink-secondary block text-[10px] uppercase tracking-wider font-semibold">
              AI Fair Range
            </span>
            <span className="font-semibold text-copper">
              ₹{listing.suggestedPriceMin} – ₹{listing.suggestedPriceMax}
            </span>
          </div>

          <div>
            <span className="text-ink-secondary block text-[10px] uppercase tracking-wider font-semibold">
              Scrap Floor
            </span>
            <span className="font-semibold text-sage-dark">
              ₹{listing.scrapValueEst || 0}
            </span>
          </div>

          <div className="text-right">
            <span className="text-ink-secondary block text-[10px] uppercase tracking-wider font-semibold">
              Counter Rounds
            </span>
            <span className={`font-mono font-bold ${isRateLimited ? "text-terracotta" : "text-ink-primary"}`}>
              {roundCount}/5
            </span>
          </div>
        </div>

        {/* Audit Trail / Message History */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
          {currentThreadOffer ? (
            <div className="space-y-3">
              {/* Initial Offer Card */}
              <div className="glass-card p-3.5 space-y-1.5 border-l-4 border-l-copper bg-white/70">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink-primary">{currentThreadOffer.buyerName}</span>
                  <span className="text-[10px] font-mono text-ink-secondary">
                    {new Date(currentThreadOffer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-ink-secondary">{currentThreadOffer.message || "Submitted offer"}</p>
                  <span className="text-sm font-extrabold text-copper bg-copper/10 px-2 py-0.5 rounded-lg">
                    Offer: ₹{currentThreadOffer.amount}
                  </span>
                </div>
              </div>

              {/* Counter-offer card if exists */}
              {currentThreadOffer.counterAmount && (
                <div className="glass-card p-3.5 space-y-1.5 border-l-4 border-l-sage bg-white/70">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink-primary">{currentThreadOffer.sellerName} (Seller)</span>
                    <span className="text-[10px] font-mono text-ink-secondary">Counter-Offer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-ink-secondary">Updated negotiation price</p>
                    <span className="text-sm font-extrabold text-sage-dark bg-sage/10 px-2 py-0.5 rounded-lg">
                      Counter: ₹{currentThreadOffer.counterAmount}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Banner */}
              <div className="p-3 rounded-2xl bg-white/60 border border-black/5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-copper" />
                  <span className="text-ink-secondary">
                    Status: <strong className="uppercase text-ink-primary">{currentThreadOffer.status}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sage-dark font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Escrow auto-triggers upon acceptance</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-ink-secondary space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-copper" />
              <p className="text-xs">No active negotiation for this item yet. Make the first offer below!</p>
              <p className="text-[11px] text-ink-secondary/80">
                Offers lock listing for 48 hours to prevent competitor snipes.
              </p>
            </div>
          )}

          {statusFeedback && (
            <div className="p-2.5 rounded-xl bg-sage/20 border border-sage/40 text-sage-dark text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusFeedback}</span>
            </div>
          )}
        </div>

        {/* Input & Action Panel */}
        <div className="pt-3 border-t border-black/5 space-y-3">
          {currentThreadOffer?.status === "accepted" ? (
            <div className="p-3.5 rounded-2xl bg-sage/15 border border-sage/40 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-sage-dark font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Offer Accepted & Escrow Created</span>
              </div>
              <p className="text-xs text-ink-secondary">
                Payment held safely. Check Escrow Status for pickup verification code.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    disabled={isRateLimited}
                    className="w-full glass-card px-3 py-2 text-sm font-bold text-ink-primary focus:outline-none focus:border-copper"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
                    Optional Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Can pick up today, need testing..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={isRateLimited}
                    className="w-full glass-card px-3 py-2 text-xs font-medium text-ink-primary focus:outline-none focus:border-copper"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {!currentThreadOffer ? (
                  <button
                    onClick={handleMakeInitialOffer}
                    className="btn-primary-pill text-xs py-2 px-5 shadow-sm"
                  >
                    <span>Submit Initial Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCounter}
                      disabled={isRateLimited}
                      className="btn-secondary-pill text-xs py-2 px-4 disabled:opacity-50"
                    >
                      <span>Counter-Offer (₹{offerAmount})</span>
                    </button>

                    <button
                      onClick={handleAccept}
                      className="btn-primary-pill text-xs py-2 px-5 bg-sage hover:bg-sage-dark shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Lock Escrow</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
