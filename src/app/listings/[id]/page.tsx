"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Lock,
  Handshake,
  AlertTriangle,
  Recycle,
  CheckCircle2,
  MapPin,
  Clock,
  Share2,
  Cpu,
  Layers,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NegotiationChatModal } from "@/components/negotiation/NegotiationChatModal";
import { EscrowStatusModal } from "@/components/escrow/EscrowStatusModal";
import { useReCircuitStore } from "@/lib/store";
import { Listing, Order } from "@/lib/types";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listings, createBuyNowOrder } = useReCircuitStore();

  const listingId = params.id as string;
  const listing = listings.find((l) => l.id === listingId);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [activeEscrowOrder, setActiveEscrowOrder] = useState<Order | null>(null);

  if (!listing) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <p className="text-sm font-bold text-copper uppercase">Listing Not Found</p>
          <h1 className="text-2xl font-bold text-ink-primary">This item has been removed or recycled.</h1>
          <Link href="/" className="btn-primary-pill text-xs py-2 px-4 inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Marketplace
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleBuyNow = () => {
    const newOrder = createBuyNowOrder(listing);
    setActiveEscrowOrder(newOrder);
  };

  const conditionColor =
    listing.condition === "working"
      ? "bg-sage/20 text-sage-dark border-sage/40"
      : listing.condition === "partial"
      ? "bg-amber-100 text-amber-900 border-amber-300"
      : "bg-terracotta/20 text-terracotta border-terracotta/40";

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* Back Link & Category Path */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-copper" />
            <span>Back to Marketplace</span>
          </Link>

          <span className="text-xs text-ink-secondary">
            {listing.categoryName} · {listing.city}
          </span>
        </div>

        {/* TOP SECTION: Gallery & Purchasing Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gallery (Left Column - 7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden glass-card border border-white/90">
              <Image
                src={listing.images[activeImageIdx] || listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
                unoptimized
              />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full border backdrop-blur-md ${conditionColor}`}
                >
                  {listing.condition.replace("_", " ")}
                </span>

                {listing.isHazardous && (
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-terracotta text-white flex items-center gap-1 shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5" /> Hazardous E-Waste
                  </span>
                )}
              </div>

              {listing.scrapValueEst && (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-glass border border-black/5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-ink-secondary block">
                    Metal Scrap Floor
                  </span>
                  <span className="font-extrabold text-sage-dark text-sm">
                    ₹{listing.scrapValueEst} Salvage Guarantee
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {listing.images.length > 1 && (
              <div className="flex items-center gap-3">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden glass-card transition-all ${
                      activeImageIdx === idx ? "border-2 border-copper scale-105" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchasing Console (Right Column - 5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-panel rounded-3xl p-6 shadow-glass border border-white/90 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-copper bg-copper/10 px-2.5 py-0.5 rounded-full">
                  Verified E-Waste Listing
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-ink-primary mt-2 leading-snug">
                  {listing.title}
                </h1>
                <p className="text-xs text-ink-secondary mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-copper" /> {listing.city} ·{" "}
                  <Clock className="w-3.5 h-3.5 text-sage-dark" /> Listed {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-white/70 border border-black/5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-ink-secondary font-semibold uppercase">Asking Price</span>
                  <span className="text-3xl font-extrabold text-ink-primary">₹{listing.askingPrice}</span>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className="text-copper font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Defensible Valuation:
                  </span>
                  <span className="font-bold text-copper">
                    ₹{listing.suggestedPriceMin} – ₹{listing.suggestedPriceMax}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleBuyNow}
                  disabled={listing.status === "sold"}
                  className="w-full btn-primary-pill text-sm py-3 justify-center shadow-md disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Buy Now with Escrow Protection (₹{listing.askingPrice})</span>
                </button>

                <button
                  onClick={() => setIsNegotiationOpen(true)}
                  disabled={listing.status === "sold"}
                  className="w-full btn-secondary-pill text-sm py-3 justify-center disabled:opacity-50"
                >
                  <Handshake className="w-4 h-4 text-copper" />
                  <span>Make an Offer / Open Negotiation Thread</span>
                </button>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="p-3 rounded-2xl bg-sage/10 border border-sage/30 flex items-start gap-2.5 text-xs text-sage-dark">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>72-Hour Escrow Protection:</strong> Funds are locked in smart escrow and only released to the seller after you inspect the hardware and confirm functionality.
                </p>
              </div>

              {/* Seller Trust Profile */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-ink-secondary text-[10px] uppercase font-bold block">Seller</span>
                  <span className="font-bold text-ink-primary">{listing.sellerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-ink-secondary text-[10px] uppercase font-bold block">Trust Score</span>
                  <span className="font-extrabold text-copper flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> {listing.sellerTrust} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: AI Scan Telemetry & Scrap Material Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Scan Inspection Report Card (Audit Trail) */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-copper/15 flex items-center justify-center text-copper">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-primary">AI Vision Diagnostic Report</h3>
                  <p className="text-[10px] font-mono text-ink-secondary">Audit Trail: {listing.scanResult?.modelVersion || "vision-v1.4"}</p>
                </div>
              </div>

              {listing.scanResult && (
                <span className="text-xs font-mono font-bold text-sage-dark bg-sage/15 px-2 py-0.5 rounded-full border border-sage/30">
                  {Math.round(listing.scanResult.confidenceScore * 100)}% Confidence
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-white/60 border border-black/5">
                  <span className="text-[10px] uppercase font-bold text-ink-secondary block">Detected Brand</span>
                  <span className="font-bold text-ink-primary">{listing.scanResult?.detectedBrand || "Unspecified"}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/60 border border-black/5">
                  <span className="text-[10px] uppercase font-bold text-ink-secondary block">Detected Model</span>
                  <span className="font-bold text-ink-primary line-clamp-1">{listing.scanResult?.detectedModel || "OEM Model"}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-ink-secondary tracking-wider block mb-1.5">
                  Visual Flaw Diagnostics (Objective Evidence):
                </span>
                <div className="space-y-1.5 bg-white/50 p-3 rounded-xl border border-black/5">
                  {listing.scanResult?.detectedFlaws.map((flaw, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-ink-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                      <span>{flaw}</span>
                    </div>
                  ))}
                </div>
              </div>

              {listing.isHazardous && (
                <div className="p-3 rounded-xl bg-terracotta/10 border border-terracotta/30 text-xs text-terracotta space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Hazardous Material Warning: {listing.scanResult?.hazardType}</span>
                  </p>
                  <p className="text-[11px] text-ink-secondary">
                    Per Section 5.2, hazardous electronics must be transported safely according to regional e-waste guidelines.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Scrap Metal & Salvage Floor Breakdown */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center text-sage-dark">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-primary">Scrap Recovery & Metal Floor</h3>
                  <p className="text-[10px] text-ink-secondary">Calculated from live scrap spot clearing rates</p>
                </div>
              </div>

              <span className="text-sm font-extrabold text-sage-dark">
                ₹{listing.scrapValueEst || 0} Total Scrap Floor
              </span>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-2 text-xs">
              <div className="bg-white/60 rounded-xl overflow-hidden border border-black/5">
                <table className="w-full text-left">
                  <thead className="bg-black/[0.03] text-[10px] font-bold uppercase text-ink-secondary border-b border-black/5">
                    <tr>
                      <th className="py-2 px-3">Reclaimable Material</th>
                      <th className="py-2 px-3">Est. Weight</th>
                      <th className="py-2 px-3">Spot Rate</th>
                      <th className="py-2 px-3 text-right">Salvage Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {listing.scanResult?.materialsBreakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/50">
                        <td className="py-2.5 px-3 font-semibold text-ink-primary">{item.name}</td>
                        <td className="py-2.5 px-3 font-mono text-ink-secondary">{item.weightKg} kg</td>
                        <td className="py-2.5 px-3 font-mono text-ink-secondary">₹{item.ratePerKg}/kg</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-copper text-right">₹{item.estimatedValue.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-ink-secondary pt-1 leading-relaxed">
                Even if this item is completely non-functional, certified recyclers will purchase it for at least <strong>₹{listing.scrapValueEst || 0}</strong> based on current spot prices.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {isNegotiationOpen && (
        <NegotiationChatModal
          isOpen={true}
          onClose={() => setIsNegotiationOpen(false)}
          listing={listing}
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
