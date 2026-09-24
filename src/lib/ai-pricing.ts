// ReCircuit AI Scan-to-Price Pipeline & Multimodal Pricing Engine

import { ItemCondition, RecyclableMaterial, ScanResult } from "./types";
import { METAL_MARKET_SPOTS } from "./seed-data";

export interface ScanPreset {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  condition: ItemCondition;
  confidence: number;
  priceMin: number;
  priceMax: number;
  scrapWeightKg: number;
  imageUrl: string;
  materials: RecyclableMaterial[];
  flaws: string[];
  isHazardous: boolean;
  hazardType?: string;
  notes: string;
}

export const DEMO_SCAN_PRESETS: ScanPreset[] = [
  {
    id: "preset_hp_charger",
    name: "HP 65W Laptop Charger",
    category: "Cables & Chargers",
    brand: "HP",
    model: "PPP009L-E 65W AC Adapter (Blue Pin)",
    condition: "partial",
    confidence: 0.94,
    priceMin: 180,
    priceMax: 260,
    scrapWeightKg: 0.28,
    imageUrl: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=900&q=80",
    materials: [
      { name: "Copper core cabling", weightKg: 0.12, ratePerKg: 645, estimatedValue: 77.4 },
      { name: "ABS enclosure plastic", weightKg: 0.16, ratePerKg: 90, estimatedValue: 14.4 },
    ],
    flaws: [
      "Frayed strain relief rubber at DC barrel junction",
      "Surface scuffs on casing; transformer core uncompromised",
      "Connector pin straight and clean",
    ],
    isHazardous: false,
    notes: "High demand for work-from-home spares. Scrap copper salvage floor is ₹77.",
  },
  {
    id: "preset_cracked_dell",
    name: "Dell Latitude E7470 Laptop",
    category: "Laptops & Desktops",
    brand: "Dell",
    model: "Latitude E7470 (Intel Core i5-6300U / 8GB)",
    condition: "for_parts",
    confidence: 0.92,
    priceMin: 2200,
    priceMax: 3100,
    scrapWeightKg: 1.55,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
    materials: [
      { name: "Magnesium/Aluminum chassis", weightKg: 0.65, ratePerKg: 280, estimatedValue: 182 },
      { name: "High-grade logic board & CPU", weightKg: 0.35, ratePerKg: 1100, estimatedValue: 385 },
      { name: "Copper heatpipe radiator", weightKg: 0.11, ratePerKg: 645, estimatedValue: 71 },
    ],
    flaws: [
      "FHD LCD panel cracked with internal ink bleed",
      "Keyboard keycap 'Ctrl' missing",
      "Motherboard and RAM modules fully verified via external HDMI",
    ],
    isHazardous: false,
    notes: "High parts-harvest value: working motherboard, cooling assembly, and RAM stick.",
  },
  {
    id: "preset_crt_monitor",
    name: "Sony Trinitron 17\" CRT Monitor",
    category: "CRT & Heavy Tech",
    brand: "Sony",
    model: "Trinitron CPD-E200",
    condition: "for_parts",
    confidence: 0.96,
    priceMin: 450,
    priceMax: 750,
    scrapWeightKg: 16.4,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    materials: [
      { name: "Pure copper deflection yoke", weightKg: 1.15, ratePerKg: 645, estimatedValue: 741.75 },
      { name: "Steel shielding cage", weightKg: 3.4, ratePerKg: 42, estimatedValue: 142.8 },
    ],
    flaws: [
      "Tube does not strike; capacitor discharge needed",
      "Contains leaded CRT funnel glass (>1.5 kg lead content)",
    ],
    isHazardous: true,
    hazardType: "Leaded Glass Tube & High Voltage Capacitors",
    notes: "Regulated hazard: mandatory disclosure required. Copper yoke alone worth ~₹742.",
  },
  {
    id: "preset_swollen_battery",
    name: "ThinkPad 72Wh Li-ion Battery",
    category: "Components & PCBs",
    brand: "Lenovo ThinkPad",
    model: "Battery 68+ 6-Cell Pack",
    condition: "for_parts",
    confidence: 0.97,
    priceMin: 100,
    priceMax: 200,
    scrapWeightKg: 0.36,
    imageUrl: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=900&q=80",
    materials: [
      { name: "BMS Board (Gold/Tin contacts)", weightKg: 0.04, ratePerKg: 1480, estimatedValue: 59.2 },
      { name: "Nickel & Aluminum internal busbars", weightKg: 0.08, ratePerKg: 320, estimatedValue: 25.6 },
    ],
    flaws: [
      "Pouch expansion (swollen cell packs)",
      "Thermal runaway hazard if punctured or compacted",
    ],
    isHazardous: true,
    hazardType: "Swollen Lithium-Ion Pouch Cells",
    notes: "Strict handling: must be transported in fire-resistant vermiculite container.",
  },
  {
    id: "preset_pcb_scrap",
    name: "Telecom Gold-Finger PCB Scrap",
    category: "Components & PCBs",
    brand: "Cisco Enterprise",
    model: "FR4 Gold-Contact Router Backplane",
    condition: "for_parts",
    confidence: 0.95,
    priceMin: 1800,
    priceMax: 2400,
    scrapWeightKg: 1.6,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    materials: [
      { name: "Gold-finger edge immersion plating", weightKg: 1.6, ratePerKg: 1480, estimatedValue: 2368 },
    ],
    flaws: [
      "SMD capacitors stripped; pure bare gold-finger board",
    ],
    isHazardous: false,
    notes: "Yield index: ~240 mg gold per kg of connector tab board.",
  },
  {
    id: "preset_logitech_mouse",
    name: "Logitech MX Master 2S Mouse",
    category: "Audio & Small Tech",
    brand: "Logitech",
    model: "MX Master 2S (Darkfield)",
    condition: "partial",
    confidence: 0.91,
    priceMin: 700,
    priceMax: 1050,
    scrapWeightKg: 0.14,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
    materials: [
      { name: "Nordic BLE Controller PCB", weightKg: 0.03, ratePerKg: 1100, estimatedValue: 33 },
      { name: "Li-Po battery & copper coils", weightKg: 0.03, ratePerKg: 380, estimatedValue: 11.4 },
    ],
    flaws: [
      "Scroll wheel ratchet clutch stuck in free-spin mode",
      "Sensor optics and microswitches fully functional",
    ],
    isHazardous: false,
    notes: "Easy mechanical fix for hobbyists. Resells at ₹1,400+ once ratchet is freed.",
  },
];

export function analyzeUploadedImage(
  imageDataOrFilename: string,
  selectedPresetId?: string
): ScanResult {
  // If a preset was matched or passed
  const preset =
    DEMO_SCAN_PRESETS.find((p) => p.id === selectedPresetId) ||
    DEMO_SCAN_PRESETS[0];

  const scrapVal = preset.materials.reduce((acc, m) => acc + m.estimatedValue, 0);

  return {
    id: `scn_${Date.now()}`,
    listingId: `lst_temp_${Date.now()}`,
    detectedBrand: preset.brand,
    detectedModel: preset.model,
    detectedCondition: preset.condition,
    confidenceScore: preset.confidence,
    suggestedPriceMin: preset.priceMin,
    suggestedPriceMax: preset.priceMax,
    scrapValueEst: Math.round(scrapVal),
    materialsBreakdown: preset.materials,
    detectedFlaws: preset.flaws,
    isHazardous: preset.isHazardous,
    hazardType: preset.hazardType,
    modelVersion: "vision-e-waste-v1.4",
    createdAt: new Date().toISOString(),
  };
}

export function calculateScrapFloor(materials: RecyclableMaterial[]): number {
  return Math.round(materials.reduce((sum, item) => sum + item.estimatedValue, 0));
}
