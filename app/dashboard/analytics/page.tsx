"use client";

import { useEffect, useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";

export default function AnalyticsPage() {
  const { restaurants, fetchRestaurants } = useRestaurant();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    totalViews: 0,
    totalReviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchRestaurants();
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchRestaurants]);

  useEffect(() => {
    const totalScans = restaurants.reduce(
      (sum, r) => sum + (r.stats?.qrScans || 0),
      0,
    );
    const totalViews = restaurants.reduce(
      (sum, r) => sum + (r.stats?.menuViews || 0),
      0,
    );
    const totalReviews = restaurants.reduce(
      (sum, r) => sum + (r.stats?.reviews || 0),
      0,
    );
    const avgRating =
      restaurants.length > 0
        ? (
            restaurants.reduce((sum, r) => sum + (r.stats?.avgRating || 0), 0) /
            restaurants.length
          ).toFixed(1)
        : 0;

    setStats({
      totalScans,
      totalViews,
      totalReviews,
      avgRating: parseFloat(avgRating as string),
    });
  }, [restaurants]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl hero-title font-bold text-slate-100">
          Analytics
        </h2>
        <p className="text-slate-400 mt-1">
          Performance metrics for your restaurants
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-lg hover:shadow-cyan-500/20">
          <p className="text-slate-400 text-sm mb-1">Total QR Scans</p>
          <p className="text-4xl font-bold text-orange-200">
            {stats.totalScans}
          </p>
          <p className="text-xs text-slate-500 mt-2">All time</p>
        </div>

        <div className="card hover:shadow-lg hover:shadow-purple-500/20">
          <p className="text-slate-400 text-sm mb-1">Menu Views</p>
          <p className="text-4xl font-bold text-amber-200">
            {stats.totalViews}
          </p>
          <p className="text-xs text-slate-500 mt-2">All time</p>
        </div>

        <div className="card hover:shadow-lg hover:shadow-blue-500/20">
          <p className="text-slate-400 text-sm mb-1">Reviews</p>
          <p className="text-4xl font-bold text-teal-200">
            {stats.totalReviews}
          </p>
          <p className="text-xs text-slate-500 mt-2">All time</p>
        </div>

        <div className="card hover:shadow-lg hover:shadow-green-500/20">
          <p className="text-slate-400 text-sm mb-1">Avg Rating</p>
          <p className="text-4xl font-bold text-green-400">
            ⭐ {stats.avgRating}
          </p>
          <p className="text-xs text-slate-500 mt-2">Out of 5</p>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="card">
        <h3 className="text-xl font-bold text-slate-100 mb-4">By Restaurant</h3>
        {restaurants.length === 0 ? (
          <p className="text-slate-400">No restaurants to display</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    Restaurant
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    QR Scans
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    Menu Views
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    Reviews
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    Avg Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(restaurant => (
                  <tr
                    key={restaurant._id}
                    className="border-b border-slate-700 hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-100">
                      {restaurant.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {restaurant.stats?.qrScans || 0}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {restaurant.stats?.menuViews || 0}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {restaurant.stats?.reviews || 0}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      ⭐ {(restaurant.stats?.avgRating || 0).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white/70 backdrop-blur-lg border border-blue-400/40">
          <h3 className="text-lg font-bold text-blue-600 mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>✓ Share your QR code on social media</li>
            <li>✓ Print QR codes and place them on tables</li>
            <li>✓ Add your profile link to delivery apps</li>
            <li>✓ Update menu items regularly for better engagement</li>
          </ul>
        </div>

        <div className="card bg-white/70 backdrop-blur-lg border border-green-400/40">
          <h3 className="text-lg font-bold text-green-600 mb-3">
            📊 What's Coming
          </h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li>📅 Daily/Weekly/Monthly trends</li>
            <li>🌍 Geographic analytics</li>
            <li>💰 Revenue tracking</li>
            <li>🤖 AI recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

