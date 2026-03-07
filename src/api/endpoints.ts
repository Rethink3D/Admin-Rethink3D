export const API_ENDPOINTS = {
  ADMIN: {
    MAKERS: "/admin/makers",
    PRODUCTS: "/admin/products",
    STATS: "/admin/stats",
    ORDERS: "/admin/orders",
    CATEGORIES: "/admin/categories",
    EMAIL: "/admin/email",
    FEEDBACKS: "/admin/feedbacks",
    USERS: "/admin/users",
    PUSH: "/admin/push-notification",
    DEVOLUTIONS: "/devolutions",
    CUSTOM_REQUESTS: "/admin/custom-requests",
  },
  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    TOP_EVENTS: "/analytics/top-events",
    TOP_PRODUCTS: "/analytics/top-products",
    TOP_MAKERS: "/analytics/top-makers",
    DOWNLOAD_STATS: "/analytics/download-stats",
    TOP_PAGES: "/analytics/top-pages",
  },
  CONSTANTS: "/constant",
} as const;
