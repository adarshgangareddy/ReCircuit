// ReCircuit Global State Store (Reactive Client & SSR-Safe State)

"use client";

import { useEffect, useState } from "react";
import { Listing, Offer, Order, User, AdminAction } from "./types";
import { SEED_LISTINGS, SEED_USERS, SEED_ADMIN_ACTIONS } from "./seed-data";

const STORAGE_KEYS = {
  CURRENT_USER_ID: "recircuit_curr_user_id",
  LISTINGS: "recircuit_listings",
  OFFERS: "recircuit_offers",
  ORDERS: "recircuit_orders",
  ADMIN_ACTIONS: "recircuit_admin_actions",
  OVERRIDE_LOGS: "recircuit_override_logs",
};

// Initial sample offers & orders for realistic dispute demonstration
const INITIAL_OFFERS: Offer[] = [
  {
    id: "off_dell_001",
    listingId: "lst_dell_laptop_02",
    listingTitle: "Dell Latitude E7470 (Broken Screen, Working Motherboard)",
    buyerId: "usr_buyer_ravi",
    buyerName: "Ravi Kumar",
    sellerId: "usr_seller_priya",
    sellerName: "Priya Sharma",
    amount: 2350,
    counterAmount: 2450,
    status: "countered",
    roundCount: 2,
    message: "Can pick up today in Koramangala. Is the battery still healthy?",
    expiresAt: new Date(Date.now() + 3600000 * 36).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "off_hp_002",
    listingId: "lst_hp_charger_01",
    listingTitle: "HP 65W Smart AC Adapter",
    buyerId: "usr_buyer_ravi",
    buyerName: "Ravi Kumar",
    sellerId: "usr_seller_priya",
    sellerName: "Priya Sharma",
    amount: 200,
    status: "accepted",
    roundCount: 1,
    message: "Need this for testing my old HP ProBook. Offer sent!",
    expiresAt: new Date(Date.now() + 3600000 * 40).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord_disp_901",
    listingId: "lst_dell_laptop_02",
    listingTitle: "Dell Latitude E7470 (Motherboard Disputed)",
    buyerId: "usr_buyer_ravi",
    buyerName: "Ravi Kumar",
    sellerId: "usr_seller_priya",
    sellerName: "Priya Sharma",
    finalPrice: 2450,
    status: "disputed",
    escrowStatus: "frozen_dispute",
    pickupCode: "RC-7821-X",
    disputeReason: "Buyer reported no HDMI display signal from motherboard during 72-hour test window.",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ord_escrow_902",
    listingId: "lst_hp_charger_01",
    listingTitle: "HP 65W Smart AC Adapter",
    buyerId: "usr_buyer_ravi",
    buyerName: "Ravi Kumar",
    sellerId: "usr_seller_priya",
    sellerName: "Priya Sharma",
    finalPrice: 200,
    status: "paid",
    escrowStatus: "held",
    pickupCode: "RC-4109-M",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

export interface PriceOverrideLog {
  listingId: string;
  brand: string;
  model: string;
  aiSuggestedMin: number;
  aiSuggestedMax: number;
  sellerAskingPrice: number;
  delta: number;
  timestamp: string;
}

export function useReCircuitStore() {
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]);
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [adminActions, setAdminActions] = useState<AdminAction[]>(SEED_ADMIN_ACTIONS);
  const [overrideLogs, setOverrideLogs] = useState<PriceOverrideLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (savedUserId) {
        const found = SEED_USERS.find((u) => u.id === savedUserId);
        if (found) setCurrentUser(found);
      }

      const savedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (savedListings) setListings(JSON.parse(savedListings));

      const savedOffers = localStorage.getItem(STORAGE_KEYS.OFFERS);
      if (savedOffers) setOffers(JSON.parse(savedOffers));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedAdminActions = localStorage.getItem(STORAGE_KEYS.ADMIN_ACTIONS);
      if (savedAdminActions) setAdminActions(JSON.parse(savedAdminActions));

      const savedOverrides = localStorage.getItem(STORAGE_KEYS.OVERRIDE_LOGS);
      if (savedOverrides) setOverrideLogs(JSON.parse(savedOverrides));
    } catch {
      // Fallback to in-memory defaults
    }
    setIsLoaded(true);
  }, []);

  const switchUser = (userId: string) => {
    const target = SEED_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, target.id);
    }
  };

  const addListing = (newListing: Listing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updated));
  };

  const updateListingStatus = (listingId: string, status: Listing["status"], reason?: string) => {
    const updated = listings.map((l) => (l.id === listingId ? { ...l, status } : l));
    setListings(updated);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updated));

    if (reason && currentUser.role === "admin") {
      logAdminAction("approve_listing", "listing", listingId, reason, listings.find(l => l.id === listingId)?.title);
    }
  };

  const createOffer = (listing: Listing, amount: number, message?: string) => {
    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      amount,
      status: "pending",
      roundCount: 1,
      message: message || "I would like to make an offer on this item.",
      expiresAt: new Date(Date.now() + 3600000 * 48).toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newOffer, ...offers];
    setOffers(updated);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(updated));
    return newOffer;
  };

  const counterOffer = (offerId: string, counterAmount: number, message?: string) => {
    const updated = offers.map((o) => {
      if (o.id === offerId) {
        return {
          ...o,
          counterAmount,
          status: "countered" as const,
          roundCount: o.roundCount + 1,
          message: message || `Counter-offer: ₹${counterAmount}`,
        };
      }
      return o;
    });
    setOffers(updated);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(updated));
  };

  const acceptOffer = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    const acceptedPrice = offer.counterAmount || offer.amount;

    // 1. Update offer status
    const updatedOffers = offers.map((o) =>
      o.id === offerId ? { ...o, status: "accepted" as const } : o
    );
    setOffers(updatedOffers);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(updatedOffers));

    // 2. Mark listing as sold
    const updatedListings = listings.map((l) =>
      l.id === offer.listingId ? { ...l, status: "sold" as const } : l
    );
    setListings(updatedListings);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));

    // 3. Create Escrow Order automatically
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      listingId: offer.listingId,
      listingTitle: offer.listingTitle,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      finalPrice: acceptedPrice,
      status: "paid",
      escrowStatus: "held",
      pickupCode: `RC-${Math.floor(1000 + Math.random() * 9000)}-Z`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    return newOrder;
  };

  const createBuyNowOrder = (listing: Listing) => {
    // 1. Mark listing as sold
    const updatedListings = listings.map((l) =>
      l.id === listing.id ? { ...l, status: "sold" as const } : l
    );
    setListings(updatedListings);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));

    // 2. Create Escrow Order
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      finalPrice: listing.askingPrice,
      status: "paid",
      escrowStatus: "held",
      pickupCode: `RC-${Math.floor(1000 + Math.random() * 9000)}-BN`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    return newOrder;
  };

  const freezeEscrowDispute = (orderId: string, reason: string) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "disputed" as const,
            escrowStatus: "frozen_dispute" as const,
            disputeReason: reason,
            updatedAt: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    logAdminAction("freeze_escrow", "order", orderId, `Dispute triggered by buyer: ${reason}`);
  };

  const resolveEscrowDispute = (orderId: string, decision: "release" | "refund", reason: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: decision === "release" ? ("completed" as const) : ("refunded" as const),
          escrowStatus: decision === "release" ? ("released" as const) : ("refunded" as const),
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    logAdminAction(
      decision === "release" ? "release_escrow" : "refund_escrow",
      "order",
      orderId,
      `Escrow decision (${decision.toUpperCase()}): ${reason}`
    );
  };

  const logAdminAction = (
    actionType: AdminAction["actionType"],
    targetType: AdminAction["targetType"],
    targetId: string,
    reason: string,
    targetTitle?: string
  ) => {
    const newAction: AdminAction = {
      id: `act_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      actionType,
      targetType,
      targetId,
      targetTitle,
      reason,
      timestamp: new Date().toISOString(),
    };
    const updated = [newAction, ...adminActions];
    setAdminActions(updated);
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACTIONS, JSON.stringify(updated));
  };

  const logPriceOverride = (log: PriceOverrideLog) => {
    const updated = [log, ...overrideLogs];
    setOverrideLogs(updated);
    localStorage.setItem(STORAGE_KEYS.OVERRIDE_LOGS, JSON.stringify(updated));
  };

  return {
    currentUser,
    switchUser,
    allUsers: SEED_USERS,
    listings,
    addListing,
    updateListingStatus,
    offers,
    createOffer,
    counterOffer,
    acceptOffer,
    orders,
    createBuyNowOrder,
    freezeEscrowDispute,
    resolveEscrowDispute,
    adminActions,
    logAdminAction,
    overrideLogs,
    logPriceOverride,
    isLoaded,
  };
}
