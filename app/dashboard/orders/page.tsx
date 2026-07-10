"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock3,
  CookingPot,
  PartyPopper,
  Store,
  CheckCircle2,
  XCircle,
  ChefHat,
  Phone,
  MessageSquareText,
  Utensils,
  Flame,
  IndianRupee,
  Sparkles,
  ReceiptText,
  RefreshCcw,
  Radio,
} from "lucide-react";
import { showToast } from "@/components/common/Toast";
import { useRestaurant } from "@/hooks/useRestaurant";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { Order, OrderStatus } from "@/lib/types";

type OrdersTab = "orders" | "pendingPreparing" | "completed";

const tabConfig: Array<{
  id: OrdersTab;
  label: string;
  icon: any;
  statuses: OrderStatus[];
}> = [
  {
    id: "orders",
    label: "Orders",
    icon: Clock3,
    statuses: ["pending"],
  },
  {
    id: "pendingPreparing",
    label: "Pending/Preparing",
    icon: CookingPot,
    statuses: ["confirmed", "preparing"],
  },
  {
    id: "completed",
    label: "Completed",
    icon: PartyPopper,
    statuses: ["completed"],
  },
];

// Presentation-only metadata — badge colors, accent dot, and icon per status.
const statusMeta: Record<
  OrderStatus,
  { label: string; badge: string; dot: string; icon: any }
> = {
  pending: {
    label: "Pending",
    badge: "border-[#F3C6BA] bg-[#FDEDE8] text-[#C1432B]",
    dot: "bg-[#E2543A]",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    badge: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
    dot: "bg-[#2F7DE1]",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Preparing",
    badge: "border-[#FBE3B8] bg-[#FEF6E7] text-[#B4740E]",
    dot: "bg-[#E8A23D]",
    icon: Flame,
  },
  completed: {
    label: "Completed",
    badge: "border-[#BFE3CD] bg-[#EAF7EF] text-[#1F7A45]",
    dot: "bg-[#2E8B57]",
    icon: PartyPopper,
  },
  cancelled: {
    label: "Cancelled",
    badge: "border-[#F4C6CE] bg-[#FDEEF1] text-[#B0304A]",
    dot: "bg-[#D6455F]",
    icon: XCircle,
  },
};

// Small reusable "punch hole" pair that turns any card into a ticket stub.
function TicketPerforation() {
  return (
    <>
      <span className="pointer-events-none absolute -left-3 top-6 h-6 w-6 rounded-full bg-[#FAFAF9]" />
      <span className="pointer-events-none absolute -right-3 top-6 h-6 w-6 rounded-full bg-[#FAFAF9]" />
      <span
        className="pointer-events-none absolute left-6 right-6 top-6 border-t border-dashed"
        style={{ borderColor: "#E4E1D8" }}
      />
    </>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurant");

  const { restaurants, fetchRestaurants } = useRestaurant();

  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<OrdersTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    pending: 0,
    confirmed: 0,
    preparing: 0,
    completed: 0,
    cancelled: 0,
    active: 0,
  });
  const [newOrderPopup, setNewOrderPopup] = useState<Order | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const seenOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingRestaurants(true);
        await fetchRestaurants();
      } finally {
        setLoadingRestaurants(false);
      }
    };

    void load();
  }, [fetchRestaurants]);

  useEffect(() => {
    if (loadingRestaurants || restaurantId || restaurants.length === 0) {
      return;
    }

    if (restaurants.length === 1) {
      router.replace(`/dashboard/orders?restaurant=${restaurants[0]._id}`);
    }
  }, [loadingRestaurants, restaurantId, restaurants, router]);

  const loadOrders = useCallback(async () => {
    if (!restaurantId) return;

    try {
      setLoadingOrders(true);
      const response = await apiClient.get<any>(
        API_ENDPOINTS.ORDERS_BY_RESTAURANT(restaurantId),
      );

      const payload = response.data || {};
      const fetchedOrders = Array.isArray(payload.orders) ? payload.orders : [];
      const fetchedCounts = payload.counts || {};

      const incomingPending = fetchedOrders.filter(
        (order: Order) => order.status === "pending",
      );

      if (seenOrderIdsRef.current.size > 0) {
        const unseenPending = incomingPending.filter(
          order => !seenOrderIdsRef.current.has(order._id),
        );

        if (unseenPending.length > 0) {
          const newestOrder = unseenPending.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0];
          setNewOrderPopup(newestOrder);
          showToast(
            `New order from ${newestOrder.customerName || "Guest"} (${newestOrder.customerPhone || "No phone"})`,
            "info",
            5000,
          );
        }
      }

      setOrders(fetchedOrders);
      setCounts(prev => ({ ...prev, ...fetchedCounts }));
      seenOrderIdsRef.current = new Set(fetchedOrders.map((o: Order) => o._id));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load orders";
      showToast(message, "error");
    } finally {
      setLoadingOrders(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) {
      setOrders([]);
      seenOrderIdsRef.current = new Set();
      return;
    }

    void loadOrders();

    const timer = setInterval(() => {
      void loadOrders();
    }, 10000);

    return () => clearInterval(timer);
  }, [restaurantId, loadOrders]);

  const filteredOrders = useMemo(() => {
    const tab = tabConfig.find(t => t.id === activeTab);
    if (!tab) return orders;
    return orders.filter(order => tab.statuses.includes(order.status));
  }, [orders, activeTab]);

  const selectedRestaurant = useMemo(
    () => restaurants.find(r => r._id === restaurantId),
    [restaurants, restaurantId],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      try {
        setStatusUpdatingId(orderId);
        const response = await apiClient.patch<any>(
          API_ENDPOINTS.ORDER_STATUS_UPDATE(orderId),
          { status },
        );
        const updated = response.data as Order;

        setOrders(prev =>
          prev.map(order =>
            order._id === updated._id ? { ...order, ...updated } : order,
          ),
        );

        showToast(`Order moved to ${status}`, "success");
        setNewOrderPopup(prev => (prev?._id === orderId ? null : prev));
        void loadOrders();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update order";
        showToast(message, "error");
      } finally {
        setStatusUpdatingId(null);
      }
    },
    [loadOrders],
  );

  const renderOrderActions = (order: Order) => {
    if (order.status === "pending") {
      return (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => void updateOrderStatus(order._id, "confirmed")}
          disabled={statusUpdatingId === order._id}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-2 text-xs font-bold text-[#1D4ED8] shadow-sm transition hover:bg-[#DCEAFE] hover:shadow-md disabled:opacity-60"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirm
        </motion.button>
      );
    }

    if (order.status === "confirmed") {
      return (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => void updateOrderStatus(order._id, "preparing")}
          disabled={statusUpdatingId === order._id}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#FBE3B8] bg-[#FEF6E7] px-3.5 py-2 text-xs font-bold text-[#B4740E] shadow-sm transition hover:bg-[#FCEBCB] hover:shadow-md disabled:opacity-60"
        >
          <Flame className="h-3.5 w-3.5" />
          Mark Preparing
        </motion.button>
      );
    }

    if (order.status === "preparing") {
      return (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => void updateOrderStatus(order._id, "completed")}
          disabled={statusUpdatingId === order._id}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#BFE3CD] bg-[#EAF7EF] px-3.5 py-2 text-xs font-bold text-[#1F7A45] shadow-sm transition hover:bg-[#D8F0E2] hover:shadow-md disabled:opacity-60"
        >
          <PartyPopper className="h-3.5 w-3.5" />
          Mark Done
        </motion.button>
      );
    }

    return null;
  };

  const fonts = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
      .font-mono-ticket { font-family: 'JetBrains Mono', monospace; }
      .font-body { font-family: 'Inter', system-ui, sans-serif; }
      @keyframes drift {
        0% { background-position: 0 0; }
        100% { background-position: 120px 120px; }
      }
      .kitchen-bg {
        background-color: #FAFAF9;
        background-image: radial-gradient(#EAE7DD 1.2px, transparent 1.2px);
        background-size: 24px 24px;
        animation: drift 14s linear infinite;
      }
    `}</style>
  );

  if (!restaurantId) {
    return (
      <div className="font-body kitchen-bg -m-4 min-h-[calc(100vh-2rem)] rounded-3xl p-4 sm:-m-6 sm:p-6">
        {fonts}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-[#EDEAE1] bg-white/90 p-10 text-center shadow-[0_24px_60px_-20px_rgba(31,36,32,0.18)] backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#FDEDE8] to-transparent blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-[#EAF7EF] to-transparent blur-2xl" />

          <motion.div
            initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 14,
              delay: 0.1,
            }}
            className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDEDE8] via-white to-[#EAF7EF] text-[#C1432B] shadow-inner"
          >
            <Store className="h-7 w-7" />
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-2xl border-2 border-[#E2543A]"
            />
          </motion.div>

          <h3 className="font-display relative mb-2 text-2xl font-bold tracking-tight text-[#22262B]">
            {loadingRestaurants
              ? "Firing up the kitchen…"
              : "Choose a restaurant"}
          </h3>
          <p className="relative mx-auto max-w-md text-sm text-[#6B7280]">
            Select a restaurant to manage incoming orders and mark preparation
            status.
          </p>

          {loadingRestaurants && (
            <div className="relative mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-[#9CA3AF]">
              <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
              Loading restaurants
            </div>
          )}

          {!loadingRestaurants && restaurants.length > 0 && (
            <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
              {restaurants.slice(0, 4).map((restaurant, i) => (
                <motion.button
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    router.replace(
                      `/dashboard/orders?restaurant=${restaurant._id}`,
                    )
                  }
                  className="group rounded-2xl border border-[#EDEAE1] bg-white px-4 py-4 text-left shadow-sm transition hover:border-[#E2543A]/40 hover:shadow-lg"
                >
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C1432B]">
                    <ChefHat className="h-3.5 w-3.5" />
                    Restaurant
                  </p>
                  <p className="font-display mt-1.5 text-base font-semibold text-[#22262B]">
                    {restaurant.name}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-body kitchen-bg -m-4 min-h-[calc(100vh-2rem)] space-y-6 rounded-3xl p-4 sm:-m-6 sm:p-6">
      {fonts}

      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-[#EDEAE1] bg-white/90 p-5 shadow-[0_16px_40px_-16px_rgba(31,36,32,0.15)] backdrop-blur-xl sm:p-7"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#FEF6E7] to-transparent blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#C1432B]">
              <Utensils className="h-3.5 w-3.5" />
              Order Operations
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#22262B] sm:text-3xl">
              {selectedRestaurant?.name || "Restaurant Orders"}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#6B7280]">
              New checkout orders appear here. Confirm, prepare, and complete
              them manually.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#BFE3CD] bg-[#EAF7EF] px-3.5 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <motion.span
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inline-flex h-full w-full rounded-full bg-[#2E8B57]"
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2E8B57]" />
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-[#1F7A45]">
              <Radio className="h-3.5 w-3.5" />
              Kitchen is live
            </span>
          </div>
        </div>
      </motion.section>

      <section className="relative grid grid-cols-1 gap-3 rounded-3xl border border-[#EDEAE1] bg-[#F3F1EA]/50 p-2 sm:grid-cols-3">
        {tabConfig.map(tab => {
          const Icon = tab.icon;
          let count = 0;
          if (tab.id === "orders") count = counts.pending || 0;
          if (tab.id === "pendingPreparing") {
            count = (counts.confirmed || 0) + (counts.preparing || 0);
          }
          if (tab.id === "completed") count = counts.completed || 0;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative rounded-2xl p-4 text-left transition"
            >
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-2xl border border-[#E2543A]/30 bg-white shadow-[0_10px_24px_-10px_rgba(226,84,58,0.35)]"
                />
              )}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 transition ${isActive ? "text-[#C1432B]" : "text-[#9CA3AF]"}`}
                  />
                  <span
                    className={`text-sm font-semibold transition ${isActive ? "text-[#22262B]" : "text-[#6B7280]"}`}
                  >
                    {tab.label}
                  </span>
                </div>
                <motion.span
                  key={count}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`font-mono-ticket rounded-full border px-2.5 py-1 text-xs font-bold ${
                    isActive
                      ? "border-[#F3C6BA] bg-[#FDEDE8] text-[#C1432B]"
                      : "border-[#EDEAE1] bg-white text-[#6B7280]"
                  }`}
                >
                  {count}
                </motion.span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        {loadingOrders && (
          <div className="flex items-center justify-center gap-2 rounded-3xl border border-[#EDEAE1] bg-white p-10 text-center text-sm font-medium text-[#6B7280]">
            <RefreshCcw className="h-4 w-4 animate-spin text-[#E2543A]" />
            Loading orders…
          </div>
        )}

        {!loadingOrders && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-[#EDEAE1] bg-white/70 p-10 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F1EA] text-[#9CA3AF]">
              <ReceiptText className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">
              No orders in this category.
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {!loadingOrders &&
            filteredOrders.map((order, orderIndex) => {
              const orderKey =
                order._id?.trim() ||
                order.orderNumber?.trim() ||
                `order-${orderIndex}`;
              const meta = statusMeta[order.status];
              const StatusIcon = meta.icon;

              return (
                <motion.article
                  key={orderKey}
                  layout
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -2 }}
                  className="relative overflow-hidden rounded-2xl border border-[#EDEAE1] bg-white p-4 pt-8 shadow-[0_6px_18px_-10px_rgba(31,36,32,0.12)] transition-shadow hover:shadow-[0_14px_30px_-14px_rgba(31,36,32,0.22)]"
                >
                  <TicketPerforation />

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono-ticket text-sm font-bold tracking-tight text-[#22262B]">
                          #
                          {order.orderNumber ||
                            order._id.slice(-6).toUpperCase()}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                          />
                          <StatusIcon className="h-3 w-3" />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#374151]">
                        <span className="font-semibold">
                          {order.customerName || "Guest"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#6B7280]">
                          <Phone className="h-3.5 w-3.5" />
                          {order.customerPhone || "No phone"}
                        </span>
                      </p>
                      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-[#6B7280]">
                        <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        Remark: {order.customerRemark || "Not provided"}
                      </p>
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-[#6B7280]">
                        <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        Cooking request:{" "}
                        {order.customerCookingRequest || "Not provided"}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                        <Clock3 className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-mono-ticket flex items-center gap-1 text-lg font-bold text-[#22262B] sm:justify-end">
                        <IndianRupee className="h-4 w-4" />
                        {Number(order.totalPrice || 0).toFixed(0)}
                      </p>
                      <p className="text-xs text-[#9CA3AF]">
                        {order.totalItems ||
                          order.lineItems?.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          ) ||
                          0}{" "}
                        items
                      </p>
                      <div className="mt-2 flex gap-2 sm:justify-end">
                        {renderOrderActions(order)}
                      </div>
                    </div>
                  </div>

                  {Array.isArray(order.lineItems) &&
                    order.lineItems.length > 0 && (
                      <div className="mt-3 rounded-xl border border-dashed border-[#EDEAE1] bg-[#FAFAF9] p-3">
                        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
                          <Utensils className="h-3 w-3" />
                          Items
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {order.lineItems.map((item, idx) => (
                            <div
                              key={`${orderKey}-${item.menuItemId || item.name || idx}`}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-[#374151]">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-mono-ticket font-semibold text-[#22262B]">
                                ₹{Number(item.lineTotal || 0).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </motion.article>
              );
            })}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {newOrderPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-start justify-center bg-[#22262B]/40 p-4 pt-20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: -80, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#EDEAE1] bg-white p-5 shadow-2xl"
            >
              <TicketPerforation />
              <div className="mb-1 flex items-center gap-2 pt-3">
                <motion.span
                  animate={{ rotate: [0, -12, 12, -8, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 1.4,
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FDEDE8] text-[#C1432B]"
                >
                  <PartyPopper className="h-4 w-4" />
                </motion.span>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C1432B]">
                  New Order Printing…
                </p>
              </div>

              <h3 className="font-display mt-2 text-xl font-bold text-[#22262B]">
                {newOrderPopup.customerName || "Guest"}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#374151]">
                <Phone className="h-3.5 w-3.5 text-[#9CA3AF]" />
                {newOrderPopup.customerPhone || "Not provided"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#374151]">
                <MessageSquareText className="h-3.5 w-3.5 text-[#9CA3AF]" />
                Remark: {newOrderPopup.customerRemark || "Not provided"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#374151]">
                <Flame className="h-3.5 w-3.5 text-[#9CA3AF]" />
                Cooking request:{" "}
                {newOrderPopup.customerCookingRequest || "Not provided"}
              </p>
              <p className="font-mono-ticket mt-2 flex items-center gap-1 text-base font-bold text-[#22262B]">
                <IndianRupee className="h-4 w-4" />
                {Number(newOrderPopup.totalPrice || 0).toFixed(0)}
              </p>

              <div className="mt-4 flex gap-2 border-t border-dashed border-[#EDEAE1] pt-4">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setNewOrderPopup(null)}
                  className="flex-1 rounded-xl border border-[#EDEAE1] bg-white px-3 py-2 text-sm font-semibold text-[#374151] transition hover:bg-[#F9F8F4]"
                >
                  Dismiss
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() =>
                    void updateOrderStatus(newOrderPopup._id, "confirmed")
                  }
                  disabled={statusUpdatingId === newOrderPopup._id}
                  className="flex-1 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#DCEAFE] disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Confirm Order
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
