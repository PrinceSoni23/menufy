// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_ME: "/auth/me",

  // Restaurants
  RESTAURANTS: "/restaurants",
  RESTAURANTS_SUMMARY: "/restaurants/summary",
  RESTAURANT_DETAIL: (id: string) => `/restaurants/${id}`,
  RESTAURANT_STATS: (id: string) => `/restaurants/${id}/stats`,

  // Menu
  MENU_ITEMS: (restaurantId: string) => `/menu/restaurant/${restaurantId}`,
  MENU_ITEM_DETAIL: (id: string) => `/menu/${id}`,
  MENU_CATEGORIES: (restaurantId: string) => `/menu/categories/${restaurantId}`,

  // Upload & Conversion
  UPLOAD_IMAGE: (restaurantId: string, menuItemId: string) =>
    `/upload/menu-item/${restaurantId}/${menuItemId}`,
  UPLOAD_3D_MODEL: (restaurantId: string, menuItemId: string) =>
    `/upload/3d-model/${restaurantId}/${menuItemId}`,
  CONVERSION_STATUS: (jobId: string) => `/upload/conversion-status/${jobId}`,
  CONVERSION_RETRY: (menuItemId: string) =>
    `/upload/retry-conversion/${menuItemId}`,
  CANCEL_CONVERSION: (jobId: string) => `/upload/cancel-conversion/${jobId}`,

  // QR Code
  QR_GENERATE: "/qrcode/generate",
  QR_GET: (restaurantId: string) => `/qrcode/${restaurantId}`,
  QR_ANALYTICS: (restaurantId: string) => `/qrcode/${restaurantId}/analytics`,
  QR_SCAN: (code: string) => `/qrcode/scan/${code}`,

  // Reviews
  REVIEWS_BY_MENU: (menuItemId: string) => `/reviews/menu/${menuItemId}`,
  REVIEWS_BY_RESTAURANT: (restaurantId: string) =>
    `/reviews/restaurant/${restaurantId}`,
  REVIEW_DETAIL: (id: string) => `/reviews/${id}`,
  REVIEW_CREATE: "/reviews",
  REVIEW_UPDATE: (id: string) => `/reviews/${id}`,
  REVIEW_DELETE: (id: string) => `/reviews/${id}`,
  REVIEW_HELPFUL: (id: string) => `/reviews/${id}/helpful`,
  REVIEW_UNHELPFUL: (id: string) => `/reviews/${id}/unhelpful`,
  MY_REVIEWS: "/reviews/user/my-reviews",

  // Analytics
  ANALYTICS_RESTAURANT: (restaurantId: string) =>
    `/analytics/restaurant/${restaurantId}`,
  ANALYTICS_TOP_ITEMS: (restaurantId: string) =>
    `/analytics/restaurant/${restaurantId}/top-items`,
  ANALYTICS_DEVICES: (restaurantId: string) =>
    `/analytics/restaurant/${restaurantId}/devices`,
  ANALYTICS_TRENDS: (restaurantId: string) =>
    `/analytics/restaurant/${restaurantId}/trends`,
  ANALYTICS_TRACK: "/analytics/track",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "ar-menu-access-token",
  REFRESH_TOKEN: "ar-menu-refresh-token",
  USER: "ar-menu-user",
  CURRENT_RESTAURANT: "ar-menu-current-restaurant",
  THEME: "ar-menu-theme",
};

// Features
export const FEATURES = [
  {
    title: "Digital Menu",
    description: "Professional digital menu that updates in real-time",
    icon: "📋",
  },
  {
    title: "Auto 3D Models",
    description: "Upload 2D images, instantly get 3D models",
    icon: "🎨",
  },
  {
    title: "AR Preview",
    description: "Customers see dishes in augmented reality",
    icon: "📱",
  },
  {
    title: "QR Codes",
    description: "Generate and track QR codes for menus",
    icon: "📲",
  },
  {
    title: "Analytics",
    description: "Track views, scans, and customer engagement",
    icon: "📊",
  },
  {
    title: "Easy Setup",
    description: "No coding required, fully managed platform",
    icon: "⚡",
  },
];

// Pricing Plans
export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "Forever",
    features: [
      "Up to 3 restaurants",
      "Up to 20 menu items per restaurant",
      "100 conversions/month (2D→3D)",
      "Basic analytics",
      "Public menu access",
      "QR code generation",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    features: [
      "Unlimited restaurants",
      "Unlimited menu items",
      "Unlimited conversions",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Multi-user access",
      "Email notifications",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Contact sales",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "API access",
      "White-label solution",
      "SLA guarantees",
      "Advanced security",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

// Cuisine Types
export const CUISINES = [
  "Italian",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
  "Mexican",
  "American",
  "French",
  "Mediterranean",
  "Korean",
  "Vietnamese",
  "Turkish",
  "Greek",
  "Spanish",
  "Filipino",
  "Lebanese",
  "African",
  "Fusion",
  "Vegetarian",
  "Vegan",
];

// Menu Categories
export const MENU_CATEGORIES = [
  "Appetizers",
  "Soups",
  "Salads",
  "Main Course",
  "Sides",
  "Desserts",
  "Beverages",
  "Alcoholic",
  "Non-Alcoholic",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Specials",
];

// Theme Colors
export const THEME_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Salmon
  "#98D8C8", // Mint
  "#F7B731", // Yellow
  "#5F27CD", // Purple
  "#00D2D3", // Cyan
  "#30336B", // Dark Blue
  "#95E1D3", // Light Green
];

// Device Types
export const DEVICE_TYPES = ["iOS", "Android", "Web"];

// API Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network connection failed. Please try again.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "This action conflicts with existing data.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Logged in successfully",
  LOGOUT: "Logged out successfully",
  REGISTER: "Account created successfully",
  RESTAURANT_CREATED: "Restaurant created successfully",
  RESTAURANT_UPDATED: "Restaurant updated successfully",
  RESTAURANT_DELETED: "Restaurant deleted successfully",
  MENU_ITEM_CREATED: "Menu item added successfully",
  MENU_ITEM_UPDATED: "Menu item updated successfully",
  MENU_ITEM_DELETED: "Menu item deleted successfully",
  IMAGE_UPLOADED: "Image uploaded successfully",
  CONVERSION_STARTED: "Conversion started. This may take a few minutes.",
};
