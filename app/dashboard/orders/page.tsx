"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, CookingPot, PartyPopper, Store } from "lucide-react";
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

const statusBadgeClass: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-sky-200 bg-sky-50 text-sky-700",
  preparing: "border-violet-200 bg-violet-50 text-violet-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

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
        <button
          onClick={() => void updateOrderStatus(order._id, "confirmed")}
          disabled={statusUpdatingId === order._id}
          className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
        >
          Confirm
        </button>
      );
    }

    if (order.status === "confirmed") {
      return (
        <button
          onClick={() => void updateOrderStatus(order._id, "preparing")}
          disabled={statusUpdatingId === order._id}
          className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"
        >
          Mark Preparing
        </button>
      );
    }

    if (order.status === "preparing") {
      return (
        <button
          onClick={() => void updateOrderStatus(order._id, "completed")}
          disabled={statusUpdatingId === order._id}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
        >
          Mark Done
        </button>
      );
    }

    return null;
  };

  if (!restaurantId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-white/85 p-10 text-center shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-violet-600">
          <Store className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-black tracking-tighter text-slate-950">
          {loadingRestaurants ? "Loading restaurants" : "Choose a restaurant"}
        </h3>
        <p className="mx-auto max-w-md text-sm text-slate-600">
          Select a restaurant to manage incoming orders and mark preparation
          status.
        </p>

        {!loadingRestaurants && restaurants.length > 0 && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {restaurants.slice(0, 4).map(restaurant => (
              <button
                key={restaurant._id}
                onClick={() =>
                  router.replace(
                    `/dashboard/orders?restaurant=${restaurant._id}`,
                  )
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                  Restaurant
                </p>
                <p className="mt-1 text-base font-semibold text-slate-950">
                  {restaurant.name}
                </p>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
          Order Operations
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
          {selectedRestaurant?.name || "Restaurant Orders"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          New checkout orders appear here. Confirm, prepare, and complete them
          manually.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tabConfig.map(tab => {
          const Icon = tab.icon;
          let count = 0;
          if (tab.id === "orders") count = counts.pending || 0;
          if (tab.id === "pendingPreparing") {
            count = (counts.confirmed || 0) + (counts.preparing || 0);
          }
          if (tab.id === "completed") count = counts.completed || 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-3xl border p-4 text-left transition ${
                activeTab === tab.id
                  ? "border-violet-200 bg-violet-50"
                  : "border-slate-200 bg-white/85 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-semibold text-slate-900">
                    {tab.label}
                  </span>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        {loadingOrders && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Loading orders...
          </div>
        )}

        {!loadingOrders && filteredOrders.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No orders in this category.
          </div>
        )}

        {!loadingOrders &&
          filteredOrders.map((order, orderIndex) => {
            const orderKey =
              order._id?.trim() ||
              order.orderNumber?.trim() ||
              `order-${orderIndex}`;

            return (
              <article
                key={orderKey}
                className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">
                        {order.orderNumber ||
                          `Order ${order._id.slice(-6).toUpperCase()}`}
                      </p>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusBadgeClass[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      {order.customerName || "Guest"} •{" "}
                      {order.customerPhone || "No phone"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Remark: {order.customerRemark || "Not provided"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-base font-black text-slate-900">
                      INR {Number(order.totalPrice || 0).toFixed(0)}
                    </p>
                    <p className="text-xs text-slate-500">
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
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Items
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {order.lineItems.map((item, idx) => (
                          <div
                            key={`${orderKey}-${item.menuItemId || item.name || idx}`}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-slate-700">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="font-semibold text-slate-900">
                              INR {Number(item.lineTotal || 0).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </article>
            );
          })}
      </section>

      <AnimatePresence>
        {newOrderPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/35 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
                New Order Alert
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-950">
                {newOrderPopup.customerName || "Guest"}
              </h3>
              <p className="mt-1 text-sm text-slate-700">
                Phone: {newOrderPopup.customerPhone || "Not provided"}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Remark: {newOrderPopup.customerRemark || "Not provided"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                INR {Number(newOrderPopup.totalPrice || 0).toFixed(0)}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setNewOrderPopup(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Dismiss
                </button>
                <button
                  onClick={() =>
                    void updateOrderStatus(newOrderPopup._id, "confirmed")
                  }
                  disabled={statusUpdatingId === newOrderPopup._id}
                  className="flex-1 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700"
                >
                  Confirm Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
