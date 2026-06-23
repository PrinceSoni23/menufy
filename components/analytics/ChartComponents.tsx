"use client";

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "cyan" | "purple" | "blue" | "green" | "orange" | "red" | "pink";
}

const colorClasses = {
  cyan: "text-cyan-400 shadow-cyan-500/20",
  purple: "text-purple-400 shadow-purple-500/20",
  blue: "text-blue-400 shadow-blue-500/20",
  green: "text-green-400 shadow-green-500/20",
  orange: "text-orange-400 shadow-orange-500/20",
  red: "text-red-400 shadow-red-500/20",
  pink: "text-pink-400 shadow-pink-500/20",
};

const baseCardClass =
  "rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(148,163,184,0.18)]";

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "cyan",
}: MetricCardProps) {
  return (
    <div
      className={`${baseCardClass} hover:shadow-lg hover:shadow-${color}-500/20`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm mb-2">{title}</p>
          <p className={`text-4xl font-bold ${colorClasses[color]}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        {icon && <div className="text-3xl opacity-20">{icon}</div>}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-semibold ${trend.isPositive ? "text-green-400" : "text-red-400"}`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
}

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
  maxValue?: number;
  color?: string;
}

export function SimpleBarChart({
  data,
  title,
  maxValue,
  color = "cyan",
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  const colorMap: { [key: string]: string } = {
    cyan: "bg-cyan-500",
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
  };

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
              <div
                className={`${colorMap[color]} h-full transition-all duration-300`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
}

export function SimpleLineChart({ data, title }: LineChartProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 100,
    y: ((max - d.value) / max) * 100,
    value: d.value,
    label: d.label,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <svg
        viewBox="0 0 100 60"
        className="w-full h-64 mb-4"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={`grid-${i}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="0.5"
          />
        ))}

        {/* Path */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.8)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>

        {/* Fill under line */}
        <path
          d={`${pathD} L 100 60 L 0 60 Z`}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill="rgb(34, 211, 238)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
        {data.map((d, i) => (
          <div key={i} className="text-slate-500">
            <div className="text-slate-700 font-medium">{d.label}</div>
            <div className="text-cyan-600">{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DoughnutChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
}

export function DoughnutChart({ data, title }: DoughnutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = [
    "rgb(34, 211, 238)", // cyan
    "rgb(168, 85, 247)", // purple
    "rgb(59, 130, 246)", // blue
  ];

  const segments = data.reduce<
    Array<{
      path: string;
      color: string;
      percentage: number;
      label: string;
      value: number;
    }>
  >((acc, d, idx) => {
    const previousTotal = acc.reduce((sum, seg) => sum + seg.value, 0);
    const percentage = (d.value / total) * 100;
    const startAngle = (previousTotal / total) * 360;
    const endAngle = ((previousTotal + d.value) / total) * 360;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = percentage > 50 ? 1 : 0;

    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    acc.push({
      path,
      color: colors[idx % colors.length],
      percentage,
      label: d.label,
      value: d.value,
    });

    return acc;
  }, []);

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg viewBox="0 0 100 100" className="w-40 h-40 shrink-0">
          {segments.map((seg, idx) => (
            <path
              key={idx}
              d={seg.path}
              fill={seg.color}
              opacity="0.8"
              className="hover:opacity-100 transition-opacity"
            />
          ))}
          <circle cx="50" cy="50" r="25" fill="rgb(255, 255, 255)" />
        </svg>

        <div className="flex-1 space-y-2">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-sm text-slate-600">{seg.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">
                  {seg.value}
                </div>
                <div className="text-xs text-slate-500">
                  {seg.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================
// ENGAGEMENT METRICS CHARTS
// ========================

interface ItemPopularityChartProps {
  data: {
    items: Array<{
      menuItemName: string;
      addToCartCount: number;
      viewCount: number;
      conversionRate: number;
    }>;
    summary: {
      totalAddToCart: number;
      averageViewsPerItem: number;
    };
  };
  title: string;
}

export function ItemPopularityChart({ data, title }: ItemPopularityChartProps) {
  if (!data || !data.items || data.items.length === 0) return null;

  const top10 = data.items.slice(0, 10);
  const maxCount = Math.max(...top10.map(i => i.addToCartCount), 1);

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="space-y-3 mb-6">
        {top10.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {idx + 1}. {item.menuItemName}
                </p>
                <p className="text-xs text-slate-500">
                  {item.viewCount} views • {item.conversionRate.toFixed(1)}%
                  conversion
                </p>
              </div>
              <span className="text-cyan-600 font-semibold">
                {item.addToCartCount}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{
                  width: `${(item.addToCartCount / maxCount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Total Add-to-Cart</p>
            <p className="text-2xl font-bold text-cyan-600">
              {data.summary.totalAddToCart}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg Views per Item</p>
            <p className="text-2xl font-bold text-purple-600">
              {data.summary.averageViewsPerItem.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EngagementFunnelChartProps {
  data: {
    funnel: Array<{
      stage: string;
      count: number;
      percentage: number;
    }>;
    summary: {
      totalScans: number;
      scanToViewConversion: number;
      viewToAddConversion: number;
      endToEndConversion: number;
    };
  };
  title: string;
}

export function EngagementFunnelChart({
  data,
  title,
}: EngagementFunnelChartProps) {
  if (!data || !data.funnel || data.funnel.length === 0) return null;

  const maxCount = Math.max(...data.funnel.map(f => f.count), 1);
  const stageLabels: { [key: string]: string } = {
    scan: "🔍 QR Scans",
    view: "👁️ Menu Views",
    add_to_cart: "🛒 Add to Cart",
  };

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="space-y-4 mb-6">
        {data.funnel.map((stage, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-sm font-medium text-slate-800">
                {stageLabels[stage.stage] || stage.stage}
              </p>
              <div className="text-right">
                <span className="text-lg font-bold text-slate-900">
                  {stage.count}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  {stage.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded h-3 overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{
                  width: `${(stage.count / maxCount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Scan→View</p>
            <p className="text-xl font-bold text-cyan-600">
              {data.summary.scanToViewConversion.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">View→Add Cart</p>
            <p className="text-xl font-bold text-blue-600">
              {data.summary.viewToAddConversion.toFixed(1)}%
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">End-to-End Conversion</p>
          <p className="text-2xl font-bold text-purple-600">
            {data.summary.endToEndConversion.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

interface ARUsageChartProps {
  data: {
    usageStats: {
      totalSessions: number;
      sessionsUsingAR: number;
      percentageUsingAR: number;
      avgARViewsPerSession: number;
    };
    breakdown: Array<{
      label: string;
      value: number;
      percentage: number;
    }>;
  };
  title: string;
}

export function ARUsageChart({ data, title }: ARUsageChartProps) {
  if (!data) return null;

  const stats = data.usageStats;
  const chartData = [
    { label: "Using AR", value: stats.sessionsUsingAR },
    {
      label: "Not Using AR",
      value: stats.totalSessions - stats.sessionsUsingAR,
    },
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const colors = ["rgb(34, 211, 238)", "rgb(100, 116, 139)"];

  let cumulativeValue = 0;
  const segments = chartData.map((d, idx) => {
    const percentage = (d.value / total) * 100;
    const startAngle = (cumulativeValue / total) * 360;
    const endAngle = ((cumulativeValue + d.value) / total) * 360;
    cumulativeValue += d.value;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = percentage > 50 ? 1 : 0;
    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      path,
      color: colors[idx],
      percentage,
      label: d.label,
      value: d.value,
    };
  });

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg viewBox="0 0 100 100" className="w-40 h-40 shrink-0">
          {segments.map((seg, idx) => (
            <path
              key={idx}
              d={seg.path}
              fill={seg.color}
              opacity="0.8"
              className="hover:opacity-100 transition-opacity"
            />
          ))}
          <circle cx="50" cy="50" r="25" fill="rgb(255, 255, 255)" />
        </svg>

        <div className="flex-1">
          <div className="mb-6 p-4 rounded-lg bg-slate-100">
            <p className="text-xs text-slate-500">AR Adoption Rate</p>
            <p className="text-3xl font-bold text-cyan-600">
              {stats.percentageUsingAR.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.sessionsUsingAR} of {stats.totalSessions} sessions
            </p>
          </div>
          <div className="space-y-2">
            {segments.map((seg, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-sm text-slate-600">{seg.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-800">
                    {seg.value}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    {seg.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">Avg AR Views per Session</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.avgARViewsPerSession.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartAbandonmentChartProps {
  data: {
    abandonmentRate: number;
    sessionStats: {
      totalSessions: number;
      sessionsWithCarts: number;
      abandonedCarts: number;
    };
    trendData: Array<{
      date: string;
      abandonmentRate: number;
    }>;
  };
  title: string;
}

export function CartAbandonmentChart({
  data,
  title,
}: CartAbandonmentChartProps) {
  if (!data) return null;

  const { abandonmentRate, sessionStats } = data;
  const completedRate = 100 - abandonmentRate;

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>

      <div className="mb-8 p-6 rounded-lg bg-slate-100 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">Abandonment Rate</p>
            <p className="text-4xl font-bold text-orange-500">
              {abandonmentRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Completed Rate</p>
            <p className="text-4xl font-bold text-green-600">
              {completedRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-green-500 to-orange-500 h-full"
              style={{ width: `${completedRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs text-slate-500">Total Sessions</p>
          <p className="text-2xl font-bold text-slate-800">
            {sessionStats.totalSessions}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Carts Created</p>
          <p className="text-2xl font-bold text-cyan-600">
            {sessionStats.sessionsWithCarts}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Abandoned</p>
          <p className="text-2xl font-bold text-orange-500">
            {sessionStats.abandonedCarts}
          </p>
        </div>
      </div>

      {/* Trend */}
      {data.trendData && data.trendData.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Trend (Last 7 days)
          </p>
          <div className="grid grid-cols-7 gap-2">
            {data.trendData.slice(-7).map((day, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-slate-100 rounded p-2 mb-1">
                  <p className="text-xs text-slate-500">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p className="text-sm font-bold text-orange-500">
                    {day.abandonmentRate.toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SessionDurationChartProps {
  data: {
    summary: {
      totalSessions: number;
      avgDurationMin: number;
      avgEventsPerSession: number;
    };
    segmentation: {
      shortSessions: { count: number; percentage: number };
      mediumSessions: { count: number; percentage: number };
      longSessions: { count: number; percentage: number };
    };
    engagement: {
      sessionsWithAR: number;
      sessionsAddingToCart: number;
    };
  };
  title: string;
}

export function SessionDurationChart({
  data,
  title,
}: SessionDurationChartProps) {
  if (!data) return null;

  const { summary, segmentation, engagement } = data;

  const segmentData = [
    {
      label: "< 1 min",
      count: segmentation.shortSessions.count,
      percentage: segmentation.shortSessions.percentage,
      color: "rgb(239, 68, 68)",
    },
    {
      label: "1-5 min",
      count: segmentation.mediumSessions.count,
      percentage: segmentation.mediumSessions.percentage,
      color: "rgb(245, 158, 11)",
    },
    {
      label: "> 5 min",
      count: segmentation.longSessions.count,
      percentage: segmentation.longSessions.percentage,
      color: "rgb(34, 197, 94)",
    },
  ];

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>

      {/* Main metric */}
      <div className="mb-8 p-6 rounded-lg bg-slate-100 border border-slate-200">
        <p className="text-sm text-slate-500 mb-1">Average Session Duration</p>
        <p className="text-4xl font-bold text-cyan-600">
          {summary.avgDurationMin.toFixed(2)} min
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {summary.totalSessions} sessions analyzed
        </p>
      </div>

      {/* Duration segments */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Session Duration Segments
        </p>
        <div className="space-y-3">
          {segmentData.map((segment, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">{segment.label}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {segment.count}{" "}
                  <span className="text-slate-500">
                    ({segment.percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    background: segment.color,
                    width: `${segment.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Using AR Feature</p>
          <p className="text-2xl font-bold text-blue-600">
            {engagement.sessionsWithAR}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Adding to Cart</p>
          <p className="text-2xl font-bold text-green-600">
            {engagement.sessionsAddingToCart}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SelectionPatternsChartProps {
  data: {
    patterns: Array<{
      items: string[];
      frequency: number;
      percentage: number;
    }>;
    summary: {
      totalCombinations: number;
      mostCommonCombo: string[];
      avgItemsPerCart: number;
    };
  };
  title: string;
}

export function SelectionPatternsChart({
  data,
  title,
}: SelectionPatternsChartProps) {
  if (!data || !data.patterns || data.patterns.length === 0) return null;

  const top10 = data.patterns.slice(0, 10);

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs text-slate-500">Unique Combinations</p>
          <p className="text-2xl font-bold text-purple-600">
            {data.summary.totalCombinations}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Avg Items per Cart</p>
          <p className="text-2xl font-bold text-cyan-600">
            {data.summary.avgItemsPerCart.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Top combinations */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Top Item Combinations
        </p>
        <div className="space-y-3">
          {top10.map((pattern, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-100 border border-slate-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-slate-800">#{idx + 1}</p>
                  <div className="mt-1 space-y-1">
                    {pattern.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="inline-block mr-2 px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {pattern.frequency}x
                  </p>
                  <p className="text-xs text-slate-500">
                    {pattern.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded h-1 overflow-hidden">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${pattern.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SalesHeatmapProps {
  title: string;
  data: {
    summary: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      dataCoveragePct: number;
    };
    peaks: {
      hour: {
        hourLabel: string;
      };
      day: {
        day: string;
      };
    };
    max: {
      cellRevenue: number;
    };
    hourOrder: Array<{ hour: number; hourLabel: string }>;
    heatmap: Array<{
      day: string;
      cells: Array<{
        hour: number;
        orders: number;
        revenue: number;
      }>;
      totalOrders: number;
      totalRevenue: number;
    }>;
  };
}

function heatColor(ratio: number): string {
  if (ratio <= 0) return "rgba(241, 245, 249, 0.9)";
  if (ratio < 0.2) return "rgba(224, 242, 254, 0.9)";
  if (ratio < 0.4) return "rgba(186, 230, 253, 0.9)";
  if (ratio < 0.6) return "rgba(167, 243, 208, 0.9)";
  if (ratio < 0.8) return "rgba(254, 215, 170, 0.9)";
  return "rgba(254, 202, 202, 0.95)";
}

export function SalesHeatmapChart({ title, data }: SalesHeatmapProps) {
  const maxRevenue = Math.max(data.max.cellRevenue, 1);

  return (
    <div className={baseCardClass}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">
            Peak Day:{" "}
            <span className="text-cyan-600">{data.peaks.day.day}</span> | Peak
            Hour:{" "}
            <span className="text-cyan-600">{data.peaks.hour.hourLabel}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-100 rounded-md px-3 py-2">
            <p className="text-slate-500">Orders</p>
            <p className="text-slate-800 font-semibold">
              {data.summary.totalOrders}
            </p>
          </div>
          <div className="bg-slate-100 rounded-md px-3 py-2">
            <p className="text-slate-500">Revenue</p>
            <p className="text-slate-800 font-semibold">
              ${data.summary.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-235">
          <div
            className="grid gap-1 mb-2"
            style={{
              gridTemplateColumns: "130px repeat(24, minmax(24px, 1fr)) 120px",
            }}
          >
            <div className="text-[11px] text-slate-500">Day / Hour</div>
            {data.hourOrder.map(hour => (
              <div
                key={hour.hour}
                className="text-[10px] text-slate-500 text-center"
              >
                {hour.hour}
              </div>
            ))}
            <div className="text-[11px] text-slate-500 text-right pr-2">
              Daily Totals
            </div>
          </div>

          {data.heatmap.map(row => (
            <div
              key={row.day}
              className="grid gap-1 mb-1"
              style={{
                gridTemplateColumns:
                  "130px repeat(24, minmax(24px, 1fr)) 120px",
              }}
            >
              <div className="text-xs text-slate-600 py-2">{row.day}</div>
              {row.cells.map(cell => {
                const ratio = cell.revenue / maxRevenue;
                return (
                  <div
                    key={`${row.day}-${cell.hour}`}
                    title={`${row.day} ${String(cell.hour).padStart(2, "0")} :00 | Orders: ${cell.orders} | Revenue: $${cell.revenue.toFixed(2)}`}
                    className="h-7 rounded-sm border border-slate-200"
                    style={{ background: heatColor(ratio) }}
                  />
                );
              })}
              <div className="text-[11px] text-right text-slate-500 py-2 pr-2">
                <span className="text-slate-700 font-medium">
                  {row.totalOrders}
                </span>
                <span className="mx-1">|</span>
                <span>${row.totalRevenue.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500">
        <span>Low</span>
        <div className="h-2 w-36 rounded-full bg-linear-to-r from-slate-200 via-cyan-400 to-rose-400" />
        <span>High</span>
        <span className="ml-auto">
          Coverage: {data.summary.dataCoveragePct}%
        </span>
      </div>
    </div>
  );
}

interface CategoryPerformanceChartProps {
  title: string;
  data: Array<{
    category: string;
    revenue: number;
    conversionRate: number;
  }>;
}

export function CategoryPerformanceChart({
  title,
  data,
}: CategoryPerformanceChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const maxConversion = Math.max(...data.map(d => d.conversionRate), 1);

  return (
    <div className={baseCardClass}>
      <h3 className="text-lg font-semibold text-slate-900 mb-5">{title}</h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={`${item.category}-${idx}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-700 font-medium">
                {item.category}
              </p>
              <div className="text-right">
                <p className="text-sm text-emerald-600 font-semibold">
                  ${item.revenue.toFixed(2)}
                </p>
                <p className="text-xs text-cyan-600">
                  {item.conversionRate.toFixed(2)}% conv
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-green-400"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <div className="h-2 w-full rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-cyan-500 to-blue-400"
                  style={{
                    width: `${(item.conversionRate / maxConversion) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Revenue
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Conversion
        </span>
      </div>
    </div>
  );
}
