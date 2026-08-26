export const APP_NAME = 'FamilyCorner'

export const CURRENCY = {
  code: 'PKR',
  symbol: 'Rs.',
  locale: 'en-PK',
} as const

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
} as const

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'brand' },
  processing: { label: 'Processing', color: 'brand' },
  shipped: { label: 'Shipped', color: 'brand' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  returned: { label: 'Returned', color: 'danger' },
}

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' },
  { id: 'jazzcash', label: 'JazzCash', icon: '📱', description: 'Pay via JazzCash mobile wallet' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: '📱', description: 'Pay via EasyPaisa mobile wallet' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard accepted' },
] as const

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const

export const CITIES_PAKISTAN = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Abbottabad', 'Mardan',
] as const

export const STORAGE_KEYS = {
  accessToken: 'gc_access_token',
  refreshToken: 'gc_refresh_token',
  cartItems: 'gc_cart',
  recentSearches: 'gc_recent_searches',
  locale: 'gc_locale',
  theme: 'gc_theme',
} as const

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyOtp: '/auth/verify-otp',
    me: '/auth/me',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    search: '/products/search',
    featured: '/products/featured',
    trending: '/products/trending',
  },
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
  },
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: (id: string) => `/cart/${id}`,
    applyCoupon: '/cart/coupon',
  },
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    create: '/orders',
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  reviews: {
    list: (productId: string) => `/products/${productId}/reviews`,
    create: (productId: string) => `/products/${productId}/reviews`,
  },
  addresses: {
    list: '/addresses',
    create: '/addresses',
    update: (id: string) => `/addresses/${id}`,
    delete: (id: string) => `/addresses/${id}`,
  },
  wishlist: {
    list: '/wishlist',
    add: '/wishlist',
    remove: (id: string) => `/wishlist/${id}`,
  },
  seller: {
    stats: '/seller/stats',
    products: '/seller/products',
    orders: '/seller/orders',
  },
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
    sellers: '/admin/sellers',
    products: '/admin/products',
    orders: '/admin/orders',
  },
} as const
