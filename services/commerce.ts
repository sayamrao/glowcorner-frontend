import type {
  Address,
  AdminStats,
  ApiResponse,
  CartItem,
  Order,
  PaginatedResponse,
  PaymentMethod,
  Category,
  Product,
  ProductListParams,
  User,
  GuestCheckoutPayload
} from '~/types'
import {
  apiClient
} from '~/services/api'
import {
  mockProducts
} from '~/services/mockData'
import {
  uid
} from '~/utils'
interface BackendPaginated < T > {
  success: boolean
  data: T[]
  meta: {
      page: number
      page_size: number
      total: number
      total_pages: number
  }
}
interface BackendProductVariant {
  id: string
  sku: string
  name: string | null
  price: string | number
  compare_at_price: string | number | null
  inventory_quantity: number
  low_stock_threshold: number
  is_active: boolean
  attributes_json: string | null
}
interface BackendProductMedia {
  id: string
  url: string
  alt_text: string | null
  media_type: string
  sort_order: number
  is_primary: boolean
}
interface BackendProductAttributeValue {
  id: string
  attribute_id: string
  attribute_name: string | null
  value: string
}
interface BackendProduct {
  id: string
  seller_id: string
  name: string
  slug: string
  base_price: string | number
  category_name: string | null
  compare_at_price: string | number | null
  status: string
  is_featured: boolean
  average_rating: string | number
  review_count: number
  primary_image ? : string | null
  description ? : string | null
  short_description ? : string | null
  category_id ? : string | null
  brand_id ? : string | null
  total_inventory: number
  variants: BackendProductVariant[]
  media: BackendProductMedia[]
  attributes ? : BackendProductAttributeValue[]
  created_at: string
  updated_at: string
}
// Global Response wrapper definitions matching standard Backend structures
interface BackendResponseWrapper < T > {
  data: T
}
interface BackendPaginationMeta {
  page: number
  limit: number
  total: number
}
interface BackendPaginatedWrapper < T > {
  data: T[]
  meta: BackendPaginationMeta
}
interface BackendAddress {
  id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  is_default: boolean
}
interface BackendOrderItem {
  id: string
  product_id: string
  product_name: string
  sku: string | null
  quantity: number
  unit_price: string | number
  total_price: string | number
}
interface BackendOrder {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: string | number
  tax_amount: string | number
  shipping_amount: string | number
  discount_amount: string | number
  total_amount: string | number
  currency: string
  items: BackendOrderItem[]
  created_at: string
  updated_at: string
}

interface BackendCategory {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  sort_order: number
  image_url: string | null
  is_active: boolean
  children: BackendCategory[]
}

export function mapBackendCategory(
  category: BackendCategory
): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.image_url || undefined,
    parentId: category.parent_id || undefined,
    children: category.children?.map(mapBackendCategory) || [],
    isActive: true,
    sortOrder: 0,
  }
}

export async function listCategories(
  activeOnly = true
): Promise<Category[]> {
  const response = await apiClient.get<
    ApiResponse<BackendCategory[]>
  >('/categories', {
    active_only: activeOnly,
  })

  return response.data.map(mapBackendCategory)
}
const money = (value: string | number | null | undefined) => Number(value ?? 0)

function fallbackImage(product: Pick < BackendProduct, 'id' | 'slug' | 'name' > ) {
  return `https://picsum.photos/seed/${encodeURIComponent(product.slug || product.id || product.name)}/600/600`
}
export function mapBackendProduct(product: BackendProduct): Product {
  const mock = mockProducts.find(item => item.id === product.id || item.slug === product.slug)
  const images = product.media?.length
    ? [...product.media]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(image => ({
          id: image.id,
          url: mediaUrl(image.url),
          alt: image.alt_text || product.name,
          isMain: image.is_primary,
        }))
    : []
  const variants = (product.variants || []).map(variant => ({
      id: variant.id,
      name: variant.name || variant.sku,
      sku: variant.sku,
      price: money(variant.price),
      stock: variant.inventory_quantity,
      attributes: {},
  }))
  const price = money(product.base_price)
  const compareAtPrice = money(product.compare_at_price)
  const stock = product.total_inventory ?? variants.reduce((sum, variant) => sum + variant.stock, 0)
  return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description || product.short_description || mock?.description || '',
      shortDescription: product.short_description || mock?.shortDescription,
      images,
      variants,
      price,
      compareAtPrice: compareAtPrice > price ? compareAtPrice : undefined,
      currency: 'PKR',
      categoryId: product.category_id || mock?.categoryId || '',
      categoryName: product.category_name || mock?.categoryName || 'FamilyCorner',
      sellerId: product.seller_id || mock?.sellerId || '',
      sellerName: mock?.sellerName || 'FamilyCorner Store',
      rating: money(product.average_rating),
      reviewCount: product.review_count,
      stock,
      isActive: product.status === 'active',
      isFeatured: product.is_featured,
      tags: mock?.tags || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at,
  }
}

function mapSort(sortBy ? : ProductListParams['sortBy']) {
  switch (sortBy) {
      case 'price_asc':
          return {
              sort_by: 'base_price', sort_order: 'asc'
          }
          case 'price_desc':
              return {
                  sort_by: 'base_price', sort_order: 'desc'
              }
              case 'rating':
                  return {
                      sort_by: 'average_rating', sort_order: 'desc'
                  }
                  case 'newest':
                      return {
                          sort_by: 'created_at', sort_order: 'desc'
                      }
                      default:
                          return {
                              sort_by: 'review_count', sort_order: 'desc'
                          }
  }
}
export async function listProducts(params: ProductListParams = {}): Promise < PaginatedResponse < Product >> {
  const sort = mapSort(params.sortBy)
  const response = await apiClient.get < BackendPaginated < BackendProduct >> ('/products', {
      page: params.page,
      page_size: params.limit,
      q: params.search,
      category_id: params.category,
      ...sort,
  })
  return {
      data: response.data.map(mapBackendProduct),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.page_size,
      totalPages: response.meta.total_pages,
  }
}
export async function getProduct(identifier: string): Promise < Product > {
  const response = await getProductRaw(identifier)
  return mapBackendProduct(response)
}
export async function getProductRaw(identifier: string): Promise < BackendProduct > {
  const endpoint = identifier.includes('-') && !/^[0-9a-f-]{36}$/i.test(identifier) ? `/products/slug/${identifier}` : `/products/${identifier}`
  const response = await apiClient.get < ApiResponse < BackendProduct >> (endpoint)
  return response.data
}
export function mapSignupPayload(payload: {
  name: string;email: string;password: string;role ? : string
}) {
  const [firstName, ...lastName] = payload.name.trim().split(/\s+/)
  return {
      email: payload.email,
      password: payload.password,
      first_name: firstName || undefined,
      last_name: lastName.join(' ') || undefined,
      role: payload.role || 'customer',
  }
}
export function mapBackendUser(data: any): User {
  return {
      id: data.id,
      email: data.email,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
      role: data.role,
      isVerified: data.is_email_verified,
      createdAt: data.created_at,
  }
}
export function mapAddress(address: BackendAddress): Address {
  return {
      id: address.id,
      name: address.full_name,
      phone: address.phone,
      street: [address.address_line1, address.address_line2].filter(Boolean).join(', '),
      city: address.city,
      state: address.state || '',
      zipCode: address.postal_code,
      country: address.country,
      isDefault: address.is_default,
  }
}
export async function createGuestOrder(payload: GuestCheckoutPayload, ): Promise < Order > {
  const response = await apiClient.post < ApiResponse < Order >> ('/orders/guest-checkout', payload, false, )
  return response.data
}
export async function createCheckoutAddress(form: {
  name: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
}) {
  const response = await apiClient.post < ApiResponse < BackendAddress >> ('/users/me/addresses', {
      label: 'Checkout',
      full_name: form.name,
      phone: form.phone,
      address_line1: form.street,
      city: form.city,
      state: form.state,
      postal_code: form.zip || '00000',
      country: 'PK',
      is_default: false,
  }, true)
  return mapAddress(response.data)
}
// export function mapOrder(order: BackendOrder): Order {
//   return {
//     id: order.id,
//     orderNumber: order.order_number,
//     status: order.status as Order['status'],
//     paymentMethod: 'cod',
//     paymentStatus: order.payment_status === 'captured' ? 'paid' : order.payment_status as Order['paymentStatus'],
//     subtotal: money(order.subtotal),
//     shipping: money(order.shipping_amount),
//     discount: money(order.discount_amount),
//     total: money(order.total_amount),
//     shippingAddress: {
//       id: '',
//       name: '',
//       phone: '',
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: 'PK',
//       isDefault: false,
//     },
//     items: order.items.map(item => {
//       const mock = mockProducts.find(product => product.id === item.product_id)
//       return {
//         id: item.id,
//         productId: item.product_id,
//         productName: item.product_name,
//         productImage: mock?.images[0]?.url || `https://picsum.photos/seed/${item.product_id}/100/100`,
//         variantName: item.sku || undefined,
//         price: money(item.unit_price),
//         quantity: item.quantity,
//         total: money(item.total_price),
//       }
//     }),
//     createdAt: order.created_at,
//     updatedAt: order.updated_at,
//   }
// }
export function mapOrder(order: BackendOrder): Order {
  return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status as Order['status'],
      paymentStatus: order.payment_status as Order['paymentStatus'],
      subtotal: money(order.subtotal),
      taxAmount: money(order.tax_amount),
      shippingAmount: money(order.shipping_amount),
      discountAmount: money(order.discount_amount),
      totalAmount: money(order.total_amount),
      currency: order.currency,
      items: order.items.map(item => {
          const mock = mockProducts.find(product => product.id === item.product_id, )
          return {
              id: item.id,
              productId: item.product_id,
              productName: item.product_name,
              sku: item.sku ?? null,
              productImage: mock?.images[0]?.url || `https://picsum.photos/seed/${item.product_id}/100/100`,
              quantity: item.quantity,
              unitPrice: money(item.unit_price),
              totalPrice: money(item.total_price),
          }
      }),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
  }
}
// export async function createOrder(payload: {
//   shippingAddressId: string
//   billingAddressId?: string
//   paymentMethod: PaymentMethod
//   notes?: string
// }) {
//   const response = await apiClient.request<ApiResponse<BackendOrder>>('/orders/checkout', {
//     method: 'POST',
//     requireAuth: true,
//     headers: { 'Idempotency-Key': uid() },
//     body: {
//       shipping_address_id: payload.shippingAddressId,
//       billing_address_id: payload.billingAddressId,
//       payment_method: payload.paymentMethod,
//       notes: payload.notes,
//     },
//   })
//   return mapOrder(response.data)
// }
// export async function createGuestOrder(payload: GuestCheckoutPayload) {
//   const response = await apiClient.request<ApiResponse<BackendOrder>>(
//   '/orders/guest-checkout',
//   {
//   method: 'POST',
//   requireAuth: false,
//   headers: {
//   'Idempotency-Key': uid(),
//   },
//   body: {
//   customer: {
//   full_name: payload.customer.fullName,
//   phone: payload.customer.phone,
//   email: payload.customer.email,
//   },
//       shipping_address: {
//         address_line1: payload.shippingAddress.addressLine1,
//         city: payload.shippingAddress.city,
//         postal_code: payload.shippingAddress.postalCode,
//         country: payload.shippingAddress.country,
//       },
//       items: payload.items.map(item => ({
//         product_id: item.productId,
//         variant_id: item.variantId,
//         quantity: item.quantity,
//       })),
//       payment_method: payload.paymentMethod,
//     },
//   },
//   )
//   return mapOrder(response.data)
//   }
export async function listOrders(page = 1, limit = 20): Promise < PaginatedResponse < Order >> {
  const response = await apiClient.get < BackendPaginated < BackendOrder >> ('/orders', {
      page,
      page_size: limit,
  }, true)
  return {
      data: response.data.map(mapOrder),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.page_size,
      totalPages: response.meta.total_pages,
  }
}
export async function getAdminStats(): Promise < AdminStats > {
  const response = await apiClient.get < ApiResponse < any >> ('/admin/dashboard', undefined, true)
  return {
      totalUsers: response.data.total_users,
      totalSellers: response.data.total_sellers,
      totalProducts: response.data.total_products,
      totalOrders: response.data.total_orders,
      totalRevenue: money(response.data.total_revenue),
      pendingApprovals: response.data.pending_seller_applications,
      recentOrders: [],
  }
}
export async function getSellerStats() {
  try {
      const response = await apiClient.get < ApiResponse < any >> ('/sellers/dashboard', undefined, true)
      return {
          totalProducts: response.data.total_products || 0,
          totalOrders: response.data.total_orders || 0,
          totalRevenue: money(response.data.total_revenue),
          pendingOrders: response.data.pending_orders || 0,
          averageRating: money(response.data.average_rating) || 0,
          monthlySales: response.data.monthly_sales || [],
      }
  } catch (e) {
      throw e
  }
}
export async function createProduct(payload: any): Promise < Product > {
  const response = await apiClient.post < ApiResponse < BackendProduct >> ('/products', payload, true)
  return mapBackendProduct(response.data)
}
export async function updateProduct(id: string, payload: any) {
  const response = await apiClient.put < ApiResponse < BackendProduct >> (`/products/${id}`, payload, true)
  return mapBackendProduct(response.data)
}
export async function deleteProduct(id: string) {
  const response = await apiClient.delete < ApiResponse < BackendProduct >> (`/products/${id}`, true)
  return response.data
}
export async function listSellerProducts(): Promise < Product[] > {
  const response = await apiClient.get < BackendPaginated < BackendProduct >> ('/products', undefined, true)
  return response.data.map(mapBackendProduct)
}
export async function listSellerOrders(): Promise < Order[] > {
  const response = await apiClient.get < BackendPaginated < BackendOrder >> ('/sellers/me/orders', undefined, true)
  return response.data.map(mapOrder)
}
export async function listAdminUsers(): Promise < any[] > {
  const response = await apiClient.get < ApiResponse < any[] >> ('/admin/users', undefined, true)
  return response.data
}
export async function listAdminModerationTasks(): Promise < any[] > {
  const response = await apiClient.get < ApiResponse < any[] >> ('/admin/moderation', undefined, true)
  return response.data
}
export function productToCartItem(product: Product, quantity = 1, variantId ? : string): Omit < CartItem, 'id' > {
  const variant = product.variants.find(item => item.id === variantId) || product.variants[0]
  return {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url || '',
      productSlug: product.slug,
      variantId: variant?.id,
      variantName: variant?.name,
      price: variant?.price || product.price,
      compareAtPrice: product.compareAtPrice,
      quantity,
      maxQuantity: variant?.stock || product.stock || 99,
      sellerName: product.sellerName,
  }
}

export async function uploadProductImage(
  productId: string,
  file: File
) {
  console.log("UPLOAD FILE", {
    name: file.name,
    type: file.type,
    size: file.size,
    isFile: file instanceof File,
  })

  const formData = new FormData()
  formData.append("file", file, file.name)

  console.log("FORM DATA", [...formData.entries()])

  return apiClient.post(
    `/products/${productId}/media`,
    formData, true
  )
}

function mediaUrl(url: string | null | undefined): string {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const baseUrl = apiClient.getBaseUrl()

  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}