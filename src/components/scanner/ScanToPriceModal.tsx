"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Sliders,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DEMO_SCAN_PRESETS, ScanPreset } from "@/lib/ai-pricing";
import { Listing, ItemCondition } from "@/lib/types";
import { useReCircuitStore } from "@/lib/store";

interface ScanToPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (listing: Listing) => void;
}

export function ScanToPriceModal({ isOpen, onClose, onListingCreated }: ScanToPriceModalProps) {
  const { currentUser, addListing, logPriceOverride } = useReCircuitStore();

  const [selectedPreset, setSelectedPreset] = useState<ScanPreset>(DEMO_SCAN_PRESETS[0]);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "result">("idle");
  const [scanStep, setScanStep] = useState(0);

  // Form State after scan
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("partial");
  const [askingPrice, setAskingPrice] = useState<number>(220);
  const [hazardAcknowledged, setHazardAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer for North Star Metric (< 60s)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const startScan = (preset: ScanPreset) => {
    setSelectedPreset(preset);
    setScanState("scanning");
    setScanStep(1);

    // Simulate multi-stage AI vision inference
    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => {
      setScanStep(4);
      setTitle(`${preset.brand} ${preset.model}`);
      setDescription(
        `AI Inspected: ${preset.brand} ${preset.model}. Condition: ${preset.condition.toUpperCase()}. ${preset.notes}`
      );
      setCondition(preset.condition);
      setAskingPrice(Math.round((preset.priceMin + preset.priceMax) / 2));
      setHazardAcknowledged(!preset.isHazardous);
      setScanState("result");
    }, 1800);
  };

  const handlePublish = () => {
    if (selectedPreset.isHazardous && !hazardAcknowledged) {
      alert("Please acknowledge the hazardous e-waste disclosure before publishing.");
      return;
    }

    setIsSubmitting(true);

    const delta = askingPrice - Math.round((selectedPreset.priceMin + selectedPreset.priceMax) / 2);
    if (Math.abs(delta) > 50) {
      logPriceOverride({
        listingId: `lst_${Date.now()}`,
        brand: selectedPreset.brand,
        model: selectedPreset.model,
        aiSuggestedMin: selectedPreset.priceMin,
        aiSuggestedMax: selectedPreset.priceMax,
        sellerAskingPrice: askingPrice,
        delta,
        timestamp: new Date().toISOString(),
      });
    }

    const newListing: Listing = {
      id: `lst_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerTrust: currentUser.trustScore,
      categoryId: selectedPreset.category.toLowerCase().replace(/\s+/g, "_"),
      categoryName: selectedPreset.category,
      title: title || `${selectedPreset.brand} ${selectedPreset.model}`,
      description: description || selectedPreset.notes,
      condition: condition,
      suggestedPrice: Math.round((selectedPreset.priceMin + selectedPreset.priceMax) / 2),
      suggestedPriceMin: selectedPreset.priceMin,
      suggestedPriceMax: selectedPreset.priceMax,
      askingPrice: askingPrice,
      scrapWeightKg: selectedPreset.scrapWeightKg,
      scrapValueEst: Math.round(
        selectedPreset.materials.reduce((acc, m) => acc + m.estimatedValue, 0)
      ),
      status: selectedPreset.isHazardous ? "pending_review" : "active",
      city: currentUser.city,
      isHazardous: selectedPreset.isHazardous,
      hazardDisclosed: hazardAcknowledged,
      images: [selectedPreset.imageUrl],
      scanResult: {
        id: `scn_${Date.now()}`,
        listingId: `lst_${Date.now()}`,
        detectedBrand: selectedPreset.brand,
        detectedModel: selectedPreset.model,
        detectedCondition: condition,
        confidenceScore: selectedPreset.confidence,
        suggestedPriceMin: selectedPreset.priceMin,
        suggestedPriceMax: selectedPreset.priceMax,
        scrapValueEst: Math.round(
          selectedPreset.materials.reduce((acc, m) => acc + m.estimatedValue, 0)
        ),
        materialsBreakdown: selectedPreset.materials,
        detectedFlaws: selectedPreset.flaws,
        isHazardous: selectedPreset.isHazardous,
        hazardType: selectedPreset.hazardType,
        modelVersion: "vision-e-waste-v1.4",
        createdAt: new Date().toISOString(),
      },
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };

    addListing(newListing);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#B8703F", "#7A8B6F", "#C9A45C"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (onListingCreated) onListingCreated(newListing);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto shadow-glass-lg border border-white/90">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-copper/15 flex items-center justify-center text-copper">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-ink-primary">AI Scan-to-Price</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-copper/10 text-copper border border-copper/20">
                  Target: &lt;60s
                </span>
              </div>
              <p className="text-xs text-ink-secondary">
                Computer vision detects brand, defects, and fair market resale or scrap floor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-black/5 text-xs font-mono text-ink-secondary">
              <span>Time:</span>
              <span className={`font-bold ${elapsedSeconds > 60 ? "text-amber-600" : "text-sage-dark"}`}>
                {elapsedSeconds}s
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-colors border border-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STEP 1: Select or Upload */}
        {scanState === "idle" && (
          <div className="mt-5 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-2.5">
                Quick Demonstration: Select an E-Waste Item to Scan
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DEMO_SCAN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => startScan(preset)}
                    className="group text-left p-3 rounded-2xl glass-card hover:border-copper/40 transition-all flex flex-col justify-between"
                  >
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2.5 bg-black/5">
                      <Image
                        src={preset.imageUrl}
                        alt={preset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      {preset.isHazardous && (
                        <div className="absolute top-1.5 right-1.5 bg-terracotta/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> Hazard
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary line-clamp-1 group-hover:text-copper transition-colors">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-ink-secondary line-clamp-1">
                        Est: ₹{preset.priceMin} - ₹{preset.priceMax}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom File Dropzone */}
            <div
              onClick={() => startScan(DEMO_SCAN_PRESETS[0])}
              className="border-2 border-dashed border-copper/30 hover:border-copper rounded-2xl p-6 text-center cursor-pointer bg-white/40 hover:bg-white/70 transition-colors"
            >
              <Upload className="w-8 h-8 text-copper mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-ink-primary">
                Upload or capture any photo from your device
              </p>
              <p className="text-xs text-ink-secondary mt-1">
                Supports JPG, PNG, WEBP · Automatic EXIF GPS stripping applied for privacy
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Scanning Laser Animation & Live Telemetry HUD */}
        {scanState === "scanning" && (
          <div className="mt-6 py-8 text-center">
            <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-glass border border-white/80">
              <Image
                src={selectedPreset.imageUrl}
                alt="Scanning item"
                fill
                className="object-cover filter contrast-105"
                unoptimized
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-copper/30 to-transparent animate-scan-line" />
              <div className="absolute inset-0 border-2 border-copper/40 rounded-2xl pointer-events-none" />

              {/* Bounding box marker */}
              <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-dashed border-white/80 rounded-lg animate-pulse" />
            </div>

            {/* Live Telemetry Progress */}
            <div className="max-w-md mx-auto mt-6 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span>AI Neural Inspector: v1.4</span>
                <span className="text-copper font-bold animate-pulse">ANALYZING...</span>
              </div>

              <div className="glass-card p-3 font-mono text-[11px] space-y-1.5 bg-black/[0.02]">
                <div className={`flex items-center gap-2 ${scanStep >= 1 ? "text-ink-primary" : "text-black/30"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 1 ? "text-sage-dark" : "text-black/20"}`} />
                  <span>Segmenting device outline & geometry...</span>
                </div>
                <div className={`flex items-center gap-2 ${scanStep >= 2 ? "text-ink-primary" : "text-black/30"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 2 ? "text-sage-dark" : "text-black/20"}`} />
                  <span>
                    Detected: <strong className="text-copper">{selectedPreset.brand}</strong> ({Math.round(selectedPreset.confidence * 100)}% confidence)
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${scanStep >= 3 ? "text-ink-primary" : "text-black/30"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 3 ? "text-sage-dark" : "text-black/20"}`} />
                  <span>Inspecting physical flaws: {selectedPreset.flaws[0]}</span>
                </div>
                <div className={`flex items-center gap-2 ${scanStep >= 4 ? "text-ink-primary" : "text-black/30"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 4 ? "text-sage-dark" : "text-black/20"}`} />
                  <span>Querying price reference & scrap metal spot floor...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Scan Results & Fast Listing Publish */}
        {scanState === "result" && (
          <div className="mt-5 space-y-5">
            {/* Top Analysis Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo preview */}
              <div className="relative h-44 md:h-full rounded-2xl overflow-hidden bg-black/5 border border-white/60">
                <Image
                  src={selectedPreset.imageUrl}
                  alt={selectedPreset.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                  AI Conf: {Math.round(selectedPreset.confidence * 100)}%
                </div>
              </div>

              {/* Price Recommendation Card */}
              <div className="md:col-span-2 glass-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-copper bg-copper/10 px-2 py-0.5 rounded-full">
                      AI Price Range (Defensible)
                    </span>
                    <h3 className="text-xl font-bold text-ink-primary mt-1">
                      ₹{selectedPreset.priceMin} – ₹{selectedPreset.priceMax}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-ink-secondary block">
                      Scrap Value Salvage Floor
                    </span>
                    <span className="text-sm font-semibold text-sage-dark">
                      ₹{selectedPreset.materials.reduce((sum, m) => sum + m.estimatedValue, 0)} (Metal Spot)
                    </span>
                  </div>
                </div>

                {/* Condition Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block mb-1.5">
                    Condition Grade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["working", "partial", "for_parts"] as ItemCondition[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCondition(c)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                          condition === c
                            ? c === "working"
                              ? "bg-sage text-white border-sage shadow-sm"
                              : c === "partial"
                              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                              : "bg-terracotta text-white border-terracotta shadow-sm"
                            : "glass-pill text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        {c.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detected Flaws Checklist */}
                <div className="bg-white/50 rounded-xl p-2.5 border border-black/5 text-xs space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary">
                    Detected Physical Indicators:
                  </p>
                  {selectedPreset.flaws.map((flaw, idx) => (
                    <p key={idx} className="text-ink-primary flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                      {flaw}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Override Slider (Section 6.1: Seller always overrides, log delta) */}
            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-copper" />
                  <label className="text-xs font-bold text-ink-primary">
                    Your Asking Price: <span className="text-base text-copper font-extrabold">₹{askingPrice}</span>
                  </label>
                </div>
                {askingPrice !== Math.round((selectedPreset.priceMin + selectedPreset.priceMax) / 2) && (
                  <span className="text-[10px] text-ink-secondary font-mono bg-white/70 px-2 py-0.5 rounded-full border border-black/5">
                    Override Delta: {askingPrice - Math.round((selectedPreset.priceMin + selectedPreset.priceMax) / 2) > 0 ? "+" : ""}
                    ₹{askingPrice - Math.round((selectedPreset.priceMin + selectedPreset.priceMax) / 2)}
                  </span>
                )}
              </div>

              <input
                type="range"
                min={Math.max(50, Math.floor(selectedPreset.priceMin * 0.5))}
                max={Math.ceil(selectedPreset.priceMax * 1.6)}
                step={10}
                value={askingPrice}
                onChange={(e) => setAskingPrice(Number(e.target.value))}
                className="w-full accent-copper cursor-pointer h-2 bg-black/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-secondary font-mono">
                <span>Min: ₹{Math.max(50, Math.floor(selectedPreset.priceMin * 0.5))}</span>
                <span className="text-copper font-semibold">AI Mid: ₹{Math.round((selectedPreset.priceMin + selectedPreset.priceMax) / 2)}</span>
                <span>Max: ₹{Math.ceil(selectedPreset.priceMax * 1.6)}</span>
              </div>
            </div>

            {/* Hazardous Material Warning (Section 5.2 & 10) */}
            {selectedPreset.isHazardous && (
              <div className="glass-card p-3.5 border-terracotta/40 bg-terracotta/5 space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-terracotta">
                      Regulated E-Waste Hazard Detected ({selectedPreset.hazardType})
                    </h4>
                    <p className="text-[11px] text-ink-secondary mt-0.5">
                      This item contains regulated materials (e.g. leaded CRT glass, swollen lithium cell). Per Section 5.2, it will be held in the Admin Moderation Queue for review before going fully live.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 text-xs font-medium text-ink-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hazardAcknowledged}
                    onChange={(e) => setHazardAcknowledged(e.target.checked)}
                    className="accent-terracotta w-4 h-4 rounded"
                  />
                  <span>I confirm the hazards are properly packaged and will not leak in transit.</span>
                </label>
              </div>
            )}

            {/* Quick Listing Metadata inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary uppercase tracking-wider text-[10px] block mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-card px-3 py-2 text-xs font-medium text-ink-primary focus:outline-none focus:border-copper"
                />
              </div>

              <div>
                <label className="font-semibold text-ink-secondary uppercase tracking-wider text-[10px] block mb-1">
                  Location / Pickup Point
                </label>
                <input
                  type="text"
                  defaultValue={currentUser.city}
                  className="w-full glass-card px-3 py-2 text-xs font-medium text-ink-primary focus:outline-none focus:border-copper"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-black/5">
              <button
                type="button"
                onClick={() => setScanState("idle")}
                className="btn-secondary-pill text-xs py-2 px-4"
              >
                Scan Another
              </button>

              <button
                type="button"
                disabled={isSubmitting || (selectedPreset.isHazardous && !hazardAcknowledged)}
                onClick={handlePublish}
                className="btn-primary-pill text-xs sm:text-sm py-2.5 px-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <span>Publish Listing in &lt;60s</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
