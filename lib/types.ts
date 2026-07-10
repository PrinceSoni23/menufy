// Dashboard
export interface DashboardSummary {
  totalRestaurants: number;
  totalMenuItems: number;
  totalQRScans: number;
  totalModelViews: number;
  modelViewsTrend: number; // percentage change from previous month
}

// User & Auth
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  avatar?: string;
  role: "owner" | "customer" | "admin";
  plan: "free" | "pro" | "enterprise";
  subscriptionStatus?: "active" | "expired" | "cancelled" | "pending";
  subscriptionPlan?: string | null;
  subscriptionEndDate?: string | null;
  paymentGateway?: string | null;
  emailVerified: boolean;
  createdAt: string;
}

// Subscription & Payment
export type PlanId =
  | "monthly_inr"
  | "monthly_usd"
  | "yearly_inr"
  | "yearly_usd";
export type GatewayId = "razorpay" | "paypal" | "payu";
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export interface Plan {
  id: PlanId;
  name: string;
  duration: "monthly" | "yearly";
  currency: "INR" | "USD";
  amount: number; // human-readable
  displayName: string;
  description: string;
}

export interface GatewayInfo {
  id: GatewayId;
  name: string;
  currencies: string[];
  supportsRecurring: boolean;
}

export interface SubscriptionStatusData {
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: PlanId | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  paymentGateway: GatewayId | null;
  plan: string;
  autoRenew: boolean;
  isRecurring: boolean;
  renewalDate: string | null;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: "INR" | "USD";
  gateway: GatewayId;
  planId: PlanId;
  keyId?: string;
  approvalUrl?: string;
  clientSecret?: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface Invoice {
  _id: string;
  gateway: GatewayId;
  planId: PlanId;
  amountDisplay: number;
  currency: "INR" | "USD";
  status: string;
  invoiceNumber: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  csrfToken?: string;
}

// Restaurant
export interface Restaurant {
  image: any;
  _id: string;
  ownerId: string;
  name: string;
  description?: string;
  cuisine: string;
  location?: string;
  address?: string;
  city?: string;
  phone: string;
  website?: string;
  imageUrl?: string;
  qrCodeId?: string;
  qrCode?: {
    url: string;
  };
  publicUrl?: string;
  totalMenuItems?: number;
  totalScans?: number;
  totalViews?: number;
  averageRating?: number;
  isActive?: boolean;
  theme?: {
    primaryColor: string;
    fontFamily: string;
    layout: "grid" | "list";
  };
  stats?: {
    qrScans: number;
    menuViews: number;
    reviews: number;
    avgRating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  cuisine: string | string[];
  address: string;
  city: string;
  phone: string;
  website?: string;
  imageUrl?: string;
}

// Menu Item
export interface MenuItemVariant {
  name: string;
  priceModifier: number;
  available: boolean;
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  category?: string;
  imageUrl2D?: string;
  model3DUrl?: string;
  variants?: MenuItemVariant[];
  arEnabled?: boolean;
  scaling?: number;
  calories?: number;
  ingredients?: string[] | string;
  views?: number;
  clicks?: number;
  arViews?: number;
  avgTimeViewed?: number;
  displayOrder?: number;
  isActive?: boolean;
  isVegetarian?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  restaurantId: string;
  imageUrl2D?: string;
  variants?: MenuItemVariant[];
  arEnabled?: boolean;
  scaling?: number;
}

// QR Code
export interface QRCode {
  _id: string;
  restaurantId: string;
  code: string;
  qrDataUrl: string;
  publicUrl: string;
  totalScans: number;
  scansToday: number;
  lastScannedAt?: string;
  uniqueDevices: number;
  createdAt: string;
  updatedAt: string;
}

// Review
export interface Review {
  _id: string;
  menuItemId: string;
  restaurantId: string;
  guestName: string;
  guestEmail?: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  menuItemId: string;
  restaurantId: string;
  guestName: string;
  guestEmail?: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

// Conversion Job
export interface ConversionJob {
  _id: string;
  menuItemId: string;
  imageUrl: string;
  tripoJobId: string;
  tripoStatus: "pending" | "processing" | "succeeded" | "failed" | "cancelled";
  progress: number;
  modelUrl?: string;
  modelPreviewUrl?: string;
  generatedAt?: string;
  error?: string;
  retries: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics
export interface Analytics {
  _id: string;
  restaurantId: string;
  menuItemId?: string;
  eventType:
    | "scan"
    | "view"
    | "ar_view"
    | "share"
    | "add_to_cart"
    | "remove_from_cart"
    | "cart_abandoned";
  deviceType: "iOS" | "Android" | "Web";
  timestamp: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
}

export interface OrderLineItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl2D?: string;
  imageUrl?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "completed"
  | "cancelled";

export interface Order {
  _id: string;
  restaurantId: string;
  sessionId: string;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerRemark?: string;
  customerCookingRequest?: string;
  totalPrice: number;
  totalItems?: number;
  currency?: string;
  status: OrderStatus;
  lineItems?: OrderLineItem[];
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  preparingAt?: string;
  completedAt?: string;
}

// Engagement Metrics - Item Popularity
export interface ItemPopularityData {
  items: Array<{
    menuItemId: string;
    menuItemName: string;
    addToCartCount: number;
    viewCount: number;
    conversionRate: number; // views -> add to cart %
  }>;
  summary: {
    totalAddToCart: number;
    averageViewsPerItem: number;
  };
}

// Engagement Metrics - Engagement Funnel
export interface EngagementFunnelData {
  funnel: Array<{
    stage: "scan" | "view" | "add_to_cart";
    count: number;
    percentage: number;
  }>;
  summary: {
    totalScans: number;
    scanToViewConversion: number; // %
    viewToAddConversion: number; // %
    endToEndConversion: number; // scan to add %
  };
}

// Engagement Metrics - AR Usage
export interface ARUsageData {
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
}

// Engagement Metrics - Cart Abandonment
export interface CartAbandonmentData {
  abandonmentRate: number; // percentage
  sessionStats: {
    totalSessions: number;
    sessionsWithCarts: number;
    abandonedCarts: number;
  };
  trendData: Array<{
    date: string;
    abandonmentRate: number;
  }>;
}

// Engagement Metrics - Session Duration
export interface SessionDurationData {
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
}

// Engagement Metrics - Selection Patterns
export interface SelectionPatternsData {
  patterns: Array<{
    items: string[]; // item names/IDs
    frequency: number;
    percentage: number;
  }>;
  summary: {
    totalCombinations: number;
    mostCommonCombo: string[];
    avgItemsPerCart: number;
  };
}

export interface DashboardStats {
  totalRestaurants: number;
  totalMenuItems: number;
  totalScans: number;
  totalViews: number;
  totalARViews: number;
  conversionStatus: {
    pending: number;
    converting: number;
    ready: number;
    failed: number;
  };
  recentScans: Analytics[];
  topMenuItems: MenuItem[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
