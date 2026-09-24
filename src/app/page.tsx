"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Scan,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Handshake,
  Lock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScanToPriceModal } from "@/components/scanner/ScanToPriceModal";
import { NegotiationChatModal } from "@/components/negotiation/NegotiationChatModal";
import { EscrowStatusModal } from "@/components/escrow/EscrowStatusModal";
import { useReCircuitStore } from "@/lib/store";
import { Listing, ItemCondition, Order } from "@/lib/types";
import { METAL_MARKET_SPOTS } from "@/lib/seed-data";

export default function HomePage() {
  const { listings, currentUser, orders, createBuyNowOrder } = useReCircuitStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeNegotiationListing, setActiveNegotiationListing] = useState<Listing | null>(null);
  const [activeEscrowOrder, setActiveEscrowOrder] = useState<Order | null>(null);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Regulated items in pending_review only visible to admin or the seller
      if (l.status === "pending_review" && currentUser.role !== "admin" && l.sellerId !== currentUser.id) {
        return false;
      }
      if (l.status === "removed") return false;

      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        l.categoryId === selectedCategory ||
        l.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesCondition =
        selectedCondition === "all" || l.condition === selectedCondition;

      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [listings, searchQuery, selectedCategory, selectedCondition, currentUser]);

  const handleBuyNow = (listing: Listing) => {
    const newOrder = createBuyNowOrder(listing);
    setActiveEscrowOrder(newOrder);
  };

  return (
    <>
      <Navbar onOpenScanner={() => setIsScannerOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-12">
        {/* HERO SECTION: Liquid Glass with Circuit Motif */}
        <section className="relative glass-card p-6 sm:p-12 overflow-hidden border border-white/80">
          <div className="relative z-10 max-w-2xl space-y-5">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-copper/30 text-xs font-semibold text-copper shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-copper" />
              <span>North Star: &lt;60 Seconds from Photo to Defensible Price</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink-primary leading-[1.15]">
              The Amazon of <span className="text-copper">E-Waste</span> & Salvage Tech
            </h1>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              Don’t guess what a broken charger or cracked laptop is worth. Our domain-intelligent vision pipeline scans brand, detects physical defects, and provides an instant defensible price range with a scrap metal salvage floor.
            </p>

            {/* Quick Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="btn-primary-pill text-sm py-3 px-6 shadow-md group"
              >
                <Scan className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>AI Scan-to-Price (Instant)</span>
              </button>

              <a
                href="#listings"
                className="btn-secondary-pill text-sm py-3 px-6"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-4 h-4 text-ink-secondary" />
              </a>
            </div>
          </div>

          {/* Abstract Circuit Graphic Accent in background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-25 hidden lg:block">
            <div className="w-full h-full rounded-full border-2 border-dashed border-copper animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-8 rounded-full border border-sage animate-spin" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
          </div>
        </section>

        {/* LIVE SCRAP METAL SPOT RATE TICKER (Section 6.1) */}
        <section id="scrap-spot" className="glass-panel rounded-2xl p-4 shadow-glass">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-copper" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Live E-Waste Salvage & Metal Spot Rates (INR)
              </h2>
            </div>
            <p className="text-[11px] text-ink-secondary">
              Updated hourly based on recycling yard scrap metal clearing prices
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
            {METAL_MARKET_SPOTS.map((spot) => (
              <div
                key={spot.code}
                className="bg-white/50 rounded-xl p-2.5 border border-black/5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink-secondary line-clamp-1">
                    {spot.metal}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1 rounded ${
                      spot.changePct > 0
                        ? "bg-sage/20 text-sage-dark"
                        : "bg-terracotta/20 text-terracotta"
                    }`}
                  >
                    {spot.changePct > 0 ? "+" : ""}
                    {spot.changePct}%
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-base font-extrabold text-ink-primary">
                    ₹{spot.rateINR}
                  </span>
                  <span className="text-[10px] text-ink-secondary">/{spot.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVE ESCROW ORDERS TRAY (If orders exist for current user) */}
        {orders.length > 0 && (
          <section className="glass-card p-4 border-copper/30 bg-copper/[0.03]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-copper" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                  Active Escrow Protected Orders ({orders.length})
                </h3>
              </div>
              <span className="text-[10px] text-ink-secondary">
                Click any order to view pickup handshake or dispute freeze
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setActiveEscrowOrder(ord)}
                  className="p-3 rounded-xl bg-white/70 hover:bg-white text-left transition-all border border-black/5 hover:border-copper/40 flex flex-col justify-between shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-ink-primary line-clamp-1">
                      {ord.listingTitle}
                    </p>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                        ord.escrowStatus === "frozen_dispute"
                          ? "bg-terracotta/15 text-terracotta"
                          : ord.escrowStatus === "released"
                          ? "bg-sage/15 text-sage-dark"
                          : "bg-copper/15 text-copper"
                      }`}
                    >
                      {ord.escrowStatus.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-copper">₹{ord.finalPrice}</span>
                    <span className="text-[10px] font-mono text-ink-secondary">
                      Token: {ord.pickupCode}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* SEARCH & FILTERS BAR */}
        <section id="categories" className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search HP charger, Dell Latitude, CRT deflection yoke, PCB scrap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-card pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink-primary focus:outline-none focus:border-copper shadow-sm placeholder:text-ink-secondary/70"
              />
            </div>

            {/* Condition Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-ink-secondary mr-1">Condition:</span>
              {[
                { id: "all", label: "All" },
                { id: "working", label: "Working", color: "text-sage-dark bg-sage/20 border-sage/40" },
                { id: "partial", label: "Partial", color: "text-amber-800 bg-amber-100 border-amber-300" },
                { id: "for_parts", label: "For Parts / Scrap", color: "text-terracotta bg-terracotta/15 border-terracotta/30" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCondition(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedCondition === c.id
                      ? "bg-ink-primary text-white border-ink-primary shadow-sm"
                      : "bg-white/70 text-ink-secondary border-black/5 hover:border-black/20"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All Tech" },
              { id: "cat_cables_chargers", label: "Cables & Chargers" },
              { id: "cat_laptops_desktops", label: "Laptops & Desktops" },
              { id: "cat_components_pcbs", label: "Components & PCBs" },
              { id: "cat_crt_heavy", label: "CRT & Heavy (Regulated)" },
              { id: "cat_audio_smalltech", label: "Audio & Small Tech" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-copper text-white border-copper shadow-sm"
                    : "glass-pill text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* LISTINGS GRID */}
        <section id="listings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-primary">
              Available E-Waste & Salvage Inventory ({filteredListings.length})
            </h2>
            <p className="text-xs text-ink-secondary">
              All listings include AI condition diagnostics and scrap fallback floor
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((listing) => {
              const conditionColor =
                listing.condition === "working"
                  ? "bg-sage/20 text-sage-dark border-sage/40"
                  : listing.condition === "partial"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-terracotta/20 text-terracotta border-terracotta/40";

              return (
                <div
                  key={listing.id}
                  className="glass-card overflow-hidden flex flex-col justify-between group hover:border-copper/40 transition-all duration-300"
                >
                  {/* Photo container */}
                  <div className="relative h-48 w-full bg-black/5 overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />

                    {/* Condition Pill */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border backdrop-blur-md ${conditionColor}`}
                      >
                        {listing.condition.replace("_", " ")}
                      </span>

                      {listing.isHazardous && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-terracotta text-white flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> Hazard
                        </span>
                      )}
                    </div>

                    {/* Status Badge if not active */}
                    {listing.status !== "active" && (
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        {listing.status.replace("_", " ")}
                      </div>
                    )}

                    {/* Scrap Salvage Floor Badge */}
                    {listing.scrapValueEst && (
                      <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md text-ink-primary text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-black/5">
                        Scrap Floor: <strong className="text-sage-dark">₹{listing.scrapValueEst}</strong>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-secondary mb-1">
                        <span>{listing.categoryName}</span>
                        <span>{listing.city}</span>
                      </div>

                      <Link href={`/listings/${listing.id}`}>
                        <h3 className="font-bold text-sm text-ink-primary group-hover:text-copper transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    {/* Pricing Block */}
                    <div className="pt-2 border-t border-black/5 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-ink-secondary uppercase block font-semibold">
                            Asking Price
                          </span>
                          <span className="text-lg font-extrabold text-ink-primary">
                            ₹{listing.askingPrice}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-copper uppercase block font-semibold">
                            AI Defensible Range
                          </span>
                          <span className="text-xs font-bold text-copper">
                            ₹{listing.suggestedPriceMin} – ₹{listing.suggestedPriceMax}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setActiveNegotiationListing(listing)}
                          disabled={listing.status === "sold"}
                          className="btn-secondary-pill text-xs py-2 px-3 justify-center disabled:opacity-50"
                        >
                          <Handshake className="w-3.5 h-3.5 text-copper" />
                          <span>Make Offer</span>
                        </button>

                        <button
                          onClick={() => handleBuyNow(listing)}
                          disabled={listing.status === "sold"}
                          className="btn-primary-pill text-xs py-2 px-3 justify-center shadow-sm disabled:opacity-50"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Buy (Escrow)</span>
                        </button>
                      </div>

                      {/* Detail Link */}
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-[11px] text-ink-secondary hover:text-copper flex items-center justify-center gap-1 pt-1 font-medium"
                      >
                        <span>View AI Diagnostic & Scrap Breakdown</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/* MODALS */}
      <ScanToPriceModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onListingCreated={(newListing) => {
          // Open negotiation or view
        }}
      />

      {activeNegotiationListing && (
        <NegotiationChatModal
          isOpen={true}
          onClose={() => setActiveNegotiationListing(null)}
          listing={activeNegotiationListing}
          onOfferAccepted={() => {
            setActiveNegotiationListing(null);
          }}
        />
      )}

      {activeEscrowOrder && (
        <EscrowStatusModal
          isOpen={true}
          onClose={() => setActiveEscrowOrder(null)}
          order={activeEscrowOrder}
        />
      )}
    </>
  );
}
