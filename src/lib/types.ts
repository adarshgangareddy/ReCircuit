// ReCircuit Core Type Definitions

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  trustScore: number; // 0.0 - 5.0
  avatarUrl?: string;
  city: string;
  twoFactorEnabled?: boolean;
}

export type ItemCondition = "working" | "partial" | "for_parts";
export type ListingStatus = "draft" | "pending_review" | "active" | "sold" | "flagged" | "removed";

export interface RecyclableMaterial {
  name: string;
  weightKg: number;
  ratePerKg: number;
  estimatedValue: number;
}

export interface ScanResult {
  id: string;
  listingId: string;
  detectedBrand: string;
  detectedModel: string;
  detectedCondition: ItemCondition;
  confidenceScore: number; // e.g. 0.91 (91%)
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  scrapValueEst: number;
  materialsBreakdown: RecyclableMaterial[];
  detectedFlaws: string[];
  isHazardous: boolean;
  hazardType?: string;
  modelVersion: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerTrust: number;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  condition: ItemCondition;
  suggestedPrice: number;
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  askingPrice: number;
  scrapWeightKg?: number;
  scrapValueEst?: number;
  status: ListingStatus;
  city: string;
  isHazardous: boolean;
  hazardDisclosed: boolean;
  images: string[];
  scanResult?: ScanResult;
  viewsCount: number;
  createdAt: string;
}

export type OfferStatus = "pending" | "countered" | "accepted" | "rejected" | "expired";

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  counterAmount?: number;
  status: OfferStatus;
  message?: string;
  parentOfferId?: string;
  roundCount: number; // Rate-limiting: max 5 counter rounds
  expiresAt: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "shipped"
  | "delivered"
  | "disputed"
  | "completed"
  | "refunded";

export type EscrowStatus = "held" | "released" | "frozen_dispute" | "refunded";

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  finalPrice: number;
  status: OrderStatus;
  escrowStatus: EscrowStatus;
  pickupCode: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  actionType:
    | "ban_user"
    | "suspend_user"
    | "approve_listing"
    | "remove_listing"
    | "freeze_escrow"
    | "release_escrow"
    | "refund_escrow"
    | "price_override";
  targetType: "user" | "listing" | "order" | "report" | "price_ref";
  targetId: string;
  targetTitle?: string;
  reason: string;
  timestamp: string;
}

export interface MetalMarketSpot {
  metal: string;
  code: string;
  unit: string;
  rateINR: number;
  trend: "up" | "down" | "stable";
  changePct: number;
}
