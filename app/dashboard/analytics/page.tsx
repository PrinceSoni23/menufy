"use client";

import { useCallback, useEffect, useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  MetricCard,
  SimpleBarChart,
  SimpleLineChart,
  DoughnutChart,
  EngagementFunnelChart,
  SalesHeatmapChart,
  CategoryPerformanceChart,
  ItemPopularityChart,
  CartAbandonmentChart,
  SessionDurationChart,
  SelectionPatternsChart,
  ARUsageChart,
} from "@/components/analytics/ChartComponents";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";

export default function AnalyticsPage() {
  const { restaurants, fetchRestaurants } = useRestaurant();
  const {
    data: analyticsData,
    loading,
    error: analyticsError,
    fetchComprehensiveAnalytics,
    itemPopularity,
    itemPopularityLoading,
    fetchItemPopularity,
    engagementFunnel,
    engagementFunnelLoading,
    fetchEngagementFunnel,
    arUsage,
    arUsageLoading,
    fetchARUsage,
    cartAbandonment,
    cartAbandonmentLoading,
    fetchCartAbandonment,
    sessionDuration,
    sessionDurationLoading,
    fetchSessionDuration,
    selectionPatterns,
    selectionPatternsLoading,
    fetchSelectionPatterns,
    salesHeatmap,
    heatmapLoading,
    heatmapError,
    fetchSalesHeatmap,
    categoryPerformance,
    categoryLoading,
    categoryError,
    fetchCategoryPerformance,
  } = useAnalytics();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [pageLoading, setPageLoading] = useState(true);

  const loadRestaurantAnalytics = useCallback(
    async (restaurantId: string) => {
      setSelectedRestaurantId(restaurantId);

      await Promise.all([
        fetchComprehensiveAnalytics(restaurantId),
        fetchSalesHeatmap(restaurantId, 30, "UTC"),
        fetchCategoryPerformance(restaurantId, 30),
        fetchItemPopularity(restaurantId, 30),
        fetchEngagementFunnel(restaurantId, 30),
        fetchARUsage(restaurantId, 30),
        fetchCartAbandonment(restaurantId, 30),
        fetchSessionDuration(restaurantId, 30),
        fetchSelectionPatterns(restaurantId, 30),
      ]);
    },
    [
      fetchComprehensiveAnalytics,
      fetchSalesHeatmap,
      fetchCategoryPerformance,
      fetchItemPopularity,
      fetchEngagementFunnel,
      fetchARUsage,
      fetchCartAbandonment,
      fetchSessionDuration,
      fetchSelectionPatterns,
    ],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchRestaurants();
      } catch (error) {
        console.error("Failed to load restaurants:", error);
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [fetchRestaurants]);

  useEffect(() => {
    const hasRestaurants = Array.isArray(restaurants) && restaurants.length > 0;
    if (hasRestaurants && !selectedRestaurantId) {
      loadRestaurantAnalytics(restaurants[0]._id);
    }
  }, [restaurants, selectedRestaurantId, loadRestaurantAnalytics]);

  const handleRestaurantChange = (restaurantId: string) => {
    loadRestaurantAnalytics(restaurantId);
  };

  const liveItemPopularity =
    itemPopularity || analyticsData?.itemPopularity || null;
  const liveEngagementFunnel =
    engagementFunnel || analyticsData?.engagementFunnel || null;
  const liveARUsage = arUsage || analyticsData?.arUsage || null;
  const liveCartAbandonment =
    cartAbandonment || analyticsData?.cartAbandonment || null;
  const liveSessionDuration =
    sessionDuration || analyticsData?.sessionDuration || null;
  const liveSelectionPatterns =
    selectionPatterns || analyticsData?.selectionPatterns || null;
  const topSelection = liveSelectionPatterns?.patterns?.[0] ?? null;
  const engagementRate =
    liveEngagementFunnel?.summary?.viewToAddConversion ??
    analyticsData?.engagement?.engagementRate ??
    0;

  const menuAdded =
    analyticsData?.engagement?.menuUsersWhoAddedItems ??
    liveEngagementFunnel?.funnel?.find((s: any) => s.stage === "add_to_cart")
      ?.count ??
    analyticsData?.summary?.totalAddToCartEvents ??
    0;
  const menuVisited =
    analyticsData?.engagement?.totalMenuUsers ??
    liveEngagementFunnel?.funnel?.find((s: any) => s.stage === "view")?.count ??
    0;
  const menuAddedPct = menuVisited > 0 ? (menuAdded / menuVisited) * 100 : 0;

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl hero-title font-bold text-slate-100">
            Analytics
          </h2>
          <p className="text-slate-400 mt-1">
            Track your restaurant performance
          </p>
        </div>
        <div className="card text-center py-12">
          <p className="text-slate-400">
            No restaurants found. Create one to see analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl hero-title font-bold text-slate-100">
          Analytics Dashboard
        </h2>
        <p className="text-slate-400 mt-1">
          Comprehensive performance metrics for{" "}
          {analyticsData?.period?.month || "your restaurant"}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {restaurants.map(restaurant => (
          <button
            key={restaurant._id}
            onClick={() => handleRestaurantChange(restaurant._id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedRestaurantId === restaurant._id
                ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500"
                : "bg-slate-700/30 text-slate-300 border border-slate-600 hover:border-slate-500"
            }`}
          >
            {restaurant.name}
          </button>
        ))}
      </div>

      {analyticsError && (
        <div className="card border border-red-500/40 bg-red-500/10">
          <p className="text-red-300 font-semibold">Unable to load analytics</p>
          <p className="text-red-200/90 text-sm mt-1">{analyticsError}</p>
        </div>
      )}

      {loading ? (
        <div className="card text-center py-12">
          <div className="inline-block animate-spin text-3xl mb-4">⚙️</div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      ) : analyticsData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total QR Scans"
              value={analyticsData.summary.totalQRScans}
              subtitle={`${analyticsData.period.month} ${analyticsData.period.year}`}
              icon="📱"
              color="cyan"
            />
            <MetricCard
              title="Total Dishes Visited"
              value={analyticsData.summary.totalDishesVisited}
              subtitle="Unique menu items viewed"
              icon="👁️"
              color="purple"
            />
            <MetricCard
              title="3D Model Views"
              value={analyticsData.summary.total3DModelViews}
              subtitle="AR engagement"
              icon="🎥"
              color="blue"
            />
            <MetricCard
              title="Estimated Sales"
              value={`$${analyticsData.summary.estimatedSales}`}
              subtitle={`Avg cart value: $${analyticsData.summary.avgOrderValue}`}
              icon={<DollarSign size={32} />}
              color="green"
            />
          </div>

          {/* MOST POPULAR COMBO and TOP 3 COMBOS (moved below) */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Customer Conversion Rate"
              value={`${(analyticsData.customers?.conversionRate ?? 0).toFixed(1)}%`}
              subtitle="Scans → Add to cart"
              icon={<TrendingUp size={32} />}
              color="orange"
            />
            <MetricCard
              title="New Customers"
              value={analyticsData.customers.newCustomers}
              subtitle="This month"
              icon={<Users size={32} />}
              color="pink"
            />
            <MetricCard
              title="Repeated Customers"
              value={analyticsData.customers.repeatedCustomers}
              subtitle={`${analyticsData.customers.totalUniqueCustomers} total unique`}
              icon={<ShoppingCart size={32} />}
              color="cyan"
            />
            <MetricCard
              title="Total Add to Cart"
              value={analyticsData.summary.totalAddToCartEvents}
              subtitle="Cart additions this month"
              icon="🛒"
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData.popularity.mostPopularDish && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🏆</span>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Most Popular Dish
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-yellow-400">
                      {analyticsData.popularity.mostPopularDish.name}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-bold text-yellow-300">
                      {analyticsData.popularity.mostPopularDish.orders}
                    </p>
                    <p className="text-slate-400">orders this month</p>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-3">
                      Top 5 ordered dishes
                    </p>
                    {analyticsData.popularity.topDishes.map((dish, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-slate-300">
                          {idx + 1}. {dish.name}
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          {dish.orders}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {analyticsData.popularity.leastPopularDish && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📉</span>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Least Ordered Dishes
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-3">
                      Bottom 5 ordered dishes
                    </p>
                    {analyticsData.popularity.bottomDishes.map((dish, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0"
                      >
                        <span className="text-slate-300">{dish.name}</span>
                        <span className="text-red-400 font-semibold">
                          {dish.orders}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DoughnutChart
              data={[
                { label: "Web", value: analyticsData.devices.Web },
                { label: "iOS", value: analyticsData.devices.iOS },
                { label: "Android", value: analyticsData.devices.Android },
              ]}
              title="Device Breakdown"
            />

            <SimpleBarChart
              data={analyticsData.topItems.slice(0, 8).map(item => ({
                label: item.name.substring(0, 15),
                value: item.views,
              }))}
              title="Top Items by Views"
              color="purple"
            />
          </div>

          {analyticsData.trends.length > 0 && (
            <SimpleLineChart
              data={analyticsData.trends.map(t => ({
                label: t._id.date,
                value: t.total,
              }))}
              title="Daily Activity Trends"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimpleBarChart
              data={[
                {
                  label: "New Customers",
                  value: analyticsData.customers.newCustomers,
                },
                {
                  label: "Repeat Customers",
                  value: analyticsData.customers.repeatedCustomers,
                },
              ]}
              title="Customer Acquisition"
              color="blue"
            />

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-200 mb-6">
                Performance Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                  <span className="text-slate-400">Avg Rating</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {analyticsData.averageRating || "N/A"}
                    {analyticsData.averageRating && "⭐"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                  <span className="text-slate-400">Unique Sessions</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {analyticsData.customers.uniqueSessionsThisMonth}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Unique Customers</span>
                  <span className="text-2xl font-bold text-green-400">
                    {analyticsData.customers.totalUniqueCustomers}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ENGAGEMENT METRICS SECTION */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <div className="mb-8">
              <h3 className="text-2xl hero-title font-bold text-slate-100 flex items-center gap-2">
                <Zap size={28} className="text-cyan-400" />
                Engagement & Behavior Analytics
              </h3>
              <p className="text-slate-400 mt-2">
                Track user engagement patterns and buying behavior
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Menu Users Added to Cart"
                value={`${menuAdded} / ${menuVisited}`}
                subtitle={`${menuAddedPct.toFixed(1)}% of visitors added to cart`}
                icon="🛒"
                color="cyan"
              />
              <MetricCard
                title="3D View Usage"
                value={`${liveARUsage?.usageStats?.percentageUsingAR ?? 0}%`}
                subtitle={`${liveARUsage?.usageStats?.sessionsUsingAR ?? 0} of ${liveARUsage?.usageStats?.totalSessions ?? 0} sessions with AR`}
                icon="🎥"
                color="blue"
              />
              <MetricCard
                title="Cart Abandonment"
                value={`${liveCartAbandonment?.abandonmentRate ?? 0}%`}
                subtitle={`${liveCartAbandonment?.sessionStats?.abandonedCarts ?? 0} of ${liveCartAbandonment?.sessionStats?.sessionsWithCarts ?? 0} carts`}
                icon="⚠️"
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <MetricCard
                title="Avg Session Duration"
                value={`${liveSessionDuration?.summary?.avgDurationMin ?? 0} min`}
                subtitle={`${liveSessionDuration?.summary?.avgEventsPerSession ?? 0} events per session`}
                icon={<BarChart3 size={32} />}
                color="purple"
              />
              <MetricCard
                title="Item Popularity"
                value={`${liveItemPopularity?.summary?.totalAddToCart ?? 0}`}
                subtitle={`"${liveItemPopularity?.items?.[0]?.menuItemName || "N/A"}" is top item`}
                icon="🏆"
                color="green"
              />
            </div>
          </div>

          {engagementFunnelLoading ? (
            <div className="card text-center py-10">
              <p className="text-slate-400">Loading engagement funnel...</p>
            </div>
          ) : (
            liveEngagementFunnel && (
              <EngagementFunnelChart
                title="Engagement Funnel"
                data={liveEngagementFunnel}
              />
            )
          )}

          {/* ITEM POPULARITY CHART */}
          {itemPopularityLoading ? (
            <div className="card text-center py-10">
              <p className="text-slate-400">Loading item popularity...</p>
            </div>
          ) : (
            liveItemPopularity?.items &&
            liveItemPopularity.items.length > 0 && (
              <ItemPopularityChart
                title="Item Popularity - Add to Cart Count"
                data={liveItemPopularity}
              />
            )
          )}

          {/* CART ABANDONMENT CHART */}
          {cartAbandonmentLoading ? (
            <div className="card text-center py-10">
              <p className="text-slate-400">Loading cart abandonment...</p>
            </div>
          ) : (
            liveCartAbandonment && (
              <CartAbandonmentChart
                title="Cart Abandonment Analysis"
                data={liveCartAbandonment}
              />
            )
          )}

          {/* SESSION DURATION CHART */}
          {sessionDurationLoading ? (
            <div className="card text-center py-10">
              <p className="text-slate-400">Loading session duration...</p>
            </div>
          ) : (
            liveSessionDuration && (
              <SessionDurationChart
                title="Session Duration Distribution"
                data={liveSessionDuration}
              />
            )
          )}

          {/* SELECTION PATTERNS CHART */}
          {selectionPatternsLoading ? (
            <div className="card text-center py-10">
              <p className="text-slate-400">Loading selection patterns...</p>
            </div>
          ) : (
            liveSelectionPatterns?.patterns &&
            liveSelectionPatterns.patterns.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SelectionPatternsChart
                    title="Popular Item Combinations"
                    data={liveSelectionPatterns}
                  />
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">
                    Top Combos
                  </h3>
                  <div className="space-y-3">
                    {liveSelectionPatterns.patterns
                      .slice(0, 3)
                      .map((p: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0"
                        >
                          <div>
                            <div className="text-slate-300">
                              {Array.isArray(p.items)
                                ? p.items.join(" + ")
                                : String(p.items)}
                            </div>
                            <div className="text-sm text-slate-500">
                              {p.frequency ?? 0} carts •{" "}
                              {Number(p.percentage ?? 0).toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-cyan-400 font-semibold">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )
          )}

          {/* AR USAGE CHART */}
          {arUsageLoading ? (
            <div className="card text-center py-10">
              <p className="text-slate-400">Loading AR usage...</p>
            </div>
          ) : (
            liveARUsage && (
              <ARUsageChart title="3D Model View Usage" data={liveARUsage} />
            )
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {heatmapLoading ? (
              <div className="card text-center py-10">
                <p className="text-slate-400">Loading sales heatmap...</p>
              </div>
            ) : (
              salesHeatmap && (
                <SalesHeatmapChart
                  title="Time-of-Day and Day-of-Week Sales Heatmap"
                  data={salesHeatmap}
                />
              )
            )}

            {categoryLoading ? (
              <div className="card text-center py-10">
                <p className="text-slate-400">
                  Loading category performance...
                </p>
              </div>
            ) : (
              categoryPerformance && (
                <CategoryPerformanceChart
                  title="Category Wise Performance"
                  data={categoryPerformance.categories
                    .slice(0, 8)
                    .map(item => ({
                      category: item.category,
                      revenue: item.revenue,
                      conversionRate: item.conversionRate,
                    }))}
                />
              )
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Analytics Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <p>
                Total QR scans this month: {analyticsData.summary.totalQRScans}
              </p>
              <p>
                Total dishes visited this month:{" "}
                {analyticsData.summary.totalDishesVisited}
              </p>
              <p>
                Total 3D model views this month:{" "}
                {analyticsData.summary.total3DModelViews}
              </p>
              <p>
                Most popular dish:{" "}
                {analyticsData.popularity.mostPopularDish?.name || "N/A"}
              </p>
              <p>
                Least added dish:{" "}
                {analyticsData.popularity.leastPopularDish?.name || "N/A"}
              </p>
              <p>
                Most popular combo:{" "}
                {liveSelectionPatterns?.summary?.mostCommonCombo
                  ? Array.isArray(liveSelectionPatterns.summary.mostCommonCombo)
                    ? liveSelectionPatterns.summary.mostCommonCombo.join(" + ")
                    : String(liveSelectionPatterns.summary.mostCommonCombo)
                  : "N/A"}
              </p>
              <p>
                Customer conversion rate:{" "}
                {(analyticsData.customers.conversionRate ?? 0).toFixed(1)}%
              </p>
              <p>
                New customers this month: {analyticsData.customers.newCustomers}
              </p>
              <p>
                Repeated customers: {analyticsData.customers.repeatedCustomers}
              </p>
              <p>Estimated sales: ${analyticsData.summary.estimatedSales}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">
            No analytics data available for this restaurant.
          </p>
        </div>
      )}
    </div>
  );
}
