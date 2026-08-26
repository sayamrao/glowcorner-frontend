/* ===== User & Auth ===== */
export type UserRole = 'customer' | 'seller' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: UserRole
  isVerified: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  phone?: string
  role?: UserRole
}

/* ===== Products ===== */
export interface ProductImage {
  id: string
  url: string
  alt: string
  isMain: boolean
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  compareAtPrice?: number
  stock: number
  attributes: Record<string, string>
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  images: ProductImage[]
  variants: ProductVariant[]
  price: number
  compareAtPrice?: number
  currency: string
  categoryId: string
  categoryName: string
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  rating: number
  reviewCount: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductListParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
  minPrice?: number
  maxPrice?: number
  rating?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/* ===== Categories ===== */

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  sortOrder: number
  imageUrl?: string | null
  isActive: boolean
  children?: Category[]
}

export interface CategoryCreatePayload {
  name: string
  slug: string
  description?: string | null
  parent_id?: string | null
  sort_order?: number
  image_url?: string | null
  is_active?: boolean
}

export interface CategoryUpdatePayload {
  name?: string
  slug?: string
  description?: string | null
  parent_id?: string | null
  sort_order?: number
  image_url?: string | null
  is_active?: boolean
}

/* ===== Cart ===== */
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  productSlug: string
  variantId?: string
  variantName?: string
  price: number
  compareAtPrice?: number
  quantity: number
  maxQuantity: number
  sellerName: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
}

/* ===== Orders ===== */
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'card'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// export interface OrderItem {
//   id: string
//   productId: string
//   productName: string
//   productImage: string
//   variantName?: string
//   price: number
//   quantity: number
//   total: number
// }

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  sku?: string | null
  variantId?: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  }

// export interface Order {
//   id: string
//   orderNumber: string
//   items: OrderItem[]
//   status: OrderStatus
//   paymentMethod: PaymentMethod
//   paymentStatus: PaymentStatus
//   subtotal: number
//   shipping: number
//   discount: number
//   total: number
//   shippingAddress: ShippingAddress
//   trackingNumber?: string
//   notes?: string
//   createdAt: string
//   updatedAt: string
// }

export interface Order {
  id: string
  orderNumber: string
  
  status: OrderStatus
  paymentStatus: PaymentStatus
  
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  currency: string
  
  items: OrderItem[]
  
  createdAt: string
  updatedAt: string
  }
  

/* ===== Guest Checkout ===== */

export interface GuestCustomer {
  full_name: string
  phone: string
  email?: string | null
  }

export interface ShippingAddress {
  address_line1: string
  city: string
  postal_code?: string | null
  country: string
}

export interface GuestCheckoutItem {
  product_id: string
  variant_id?: string | null
  quantity: number
}

export interface GuestCheckoutPayload {
  customer: GuestCustomer
  shipping_address: ShippingAddress
  items: GuestCheckoutItem[]
  payment_method: PaymentMethod
}

/* ===== Addresses ===== */
export interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

/* ===== Reviews ===== */
export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  productId: string
  rating: number
  title: string
  comment: string
  images?: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
}

/* ===== Wishlist ===== */
export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

/* ===== Notifications ===== */
export type NotificationType = 'order' | 'promo' | 'system' | 'review'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

/* ===== Seller ===== */
export interface SellerStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  averageRating: number
  monthlySales: { month: string; amount: number }[]
}

/* ===== Admin ===== */
export interface AdminStats {
  totalUsers: number
  totalSellers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingApprovals: number
  recentOrders: Order[]
}

/* ===== Banner ===== */
export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  link: string
  isActive: boolean
}

/* ===== API Response ===== */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

/* ===== Coupon ===== */
export interface Coupon {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderAmount?: number
  maxDiscount?: number
  isValid: boolean
}
