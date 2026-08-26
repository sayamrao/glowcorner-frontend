import { CURRENCY } from '~/constants'

/**
 * Format price with PKR currency
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol} ${amount.toLocaleString(CURRENCY.locale)}`
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Generate product slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]

  for (const [secs, label] of intervals) {
    const interval = Math.floor(seconds / secs)
    if (interval >= 1) {
      return `${interval} ${label}${interval > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

/**
 * Generate WhatsApp order message
 */
export function generateWhatsAppOrderUrl(
  phone: string,
  items: { name: string; quantity: number; price: number }[],
  total: number,
): string {
  const itemLines = items
    .map((item) => `• ${item.name} (Qty: ${item.quantity}) — ${formatPrice(item.price * item.quantity)}`)
    .join('\n')

  const message = `Assalam-o-Alaikum! 🛒\n\nI want to order:\n${itemLines}\n\n💰 Total: ${formatPrice(total)}\n\nPlease confirm availability and delivery details. JazakAllah!`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Generate star rating display
 */
export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}

/**
 * Secure storage wrapper
 */
export const secureStorage = {
  get(key: string): string | null {
    if (import.meta.server) return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    if (import.meta.server) return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Storage full or blocked
    }
  },
  remove(key: string): void {
    if (import.meta.server) return
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore
    }
  },
}

/**
 * Generate unique ID
 */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}
