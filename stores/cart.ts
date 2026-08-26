import { defineStore } from 'pinia'
import type { CartItem, Coupon } from '~/types'
import { STORAGE_KEYS } from '~/constants'
import { secureStorage, uid } from '~/utils'
import { apiClient } from '~/services/api'

interface CartState {
  items: CartItem[]
  coupon: Coupon | null
  isLoading: boolean
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    coupon: null,
    isLoading: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    savings: (state) => state.items.reduce((sum, item) => {
      const compare = item.compareAtPrice || item.price
      return sum + (compare - item.price) * item.quantity
    }, 0),

    shipping(): number {
      // Free shipping over Rs. 3000
      return this.subtotal >= 3000 ? 0 : 150
    },

    discount(state): number {
      if (!state.coupon) return 0
      if (state.coupon.discountType === 'percentage') {
        const disc = this.subtotal * (state.coupon.discountValue / 100)
        return state.coupon.maxDiscount ? Math.min(disc, state.coupon.maxDiscount) : disc
      }
      return state.coupon.discountValue
    },

    total(): number {
      return Math.max(0, this.subtotal + this.shipping - this.discount)
    },

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    hasAuthToken() {
      return !!secureStorage.get(STORAGE_KEYS.accessToken)
    },

    /**
     * Load cart from localStorage (for guest cart persistence)
     */
    loadFromStorage() {
      const stored = secureStorage.get(STORAGE_KEYS.cartItems)
      if (stored) {
        try {
          this.items = JSON.parse(stored)
        } catch {
          this.items = []
        }
      }
    },

    /**
     * Persist cart to localStorage
     */
    saveToStorage() {
      secureStorage.set(STORAGE_KEYS.cartItems, JSON.stringify(this.items))
    },

    /**
     * Add item to cart
     */
    addItem(item: Omit<CartItem, 'id'>) {
      const existing = this.items.find(
        i => i.productId === item.productId && i.variantId === item.variantId,
      )
    
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + item.quantity,
          existing.maxQuantity,
        )
      } else {
        this.items.push({
          ...item,
          id: uid(),
        })
      }
    
      // Always persist locally.
      this.saveToStorage()
    
      // Only synchronize with backend when authenticated.
      if (this.hasAuthToken()) {
        apiClient.post(
          '/cart/items',
          {
            product_id: item.productId,
            variant_id: item.variantId,
            quantity: item.quantity,
          },
          true,
        ).catch(() => {
          // Local cart remains available.
        })
      }
    },

    /**
     * Update item quantity
     */
    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else {
          item.quantity = Math.min(quantity, item.maxQuantity)
          this.saveToStorage()
          if (this.hasAuthToken()) {
            apiClient.patch(`/cart/items/${item.id}`, { quantity: item.quantity }, true).catch(() => {
              // Backend cart ids can differ from local ids until full cart hydration is enabled.
            })
          }
        }
      }
    },

    /**
     * Remove item from cart
     */
    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId)
      this.saveToStorage()
      if(this.hasAuthToken()) {
        apiClient.delete(`/cart/items/${itemId}`, this.hasAuthToken()).catch(() => {
          // Backend cart ids can differ from local ids until full cart hydration is enabled.
        })
      }
    },

    /**
     * Apply coupon code
     */
    async applyCoupon(code: string) {
      this.isLoading = true
      try {
        await apiClient.post('/cart/coupon', { coupon_code: code }, this.hasAuthToken()).catch(() => null)

        // Local coupon math stays in-browser until coupon details are exposed by the API.
        if (code.toUpperCase() === 'FAMILY30') {
          this.coupon = {
            code: 'FAMILY30',
            discountType: 'percentage',
            discountValue: 30,
            maxDiscount: 1500,
            minOrderAmount: 1000,
            isValid: true,
          }
          return true
        } else if (code.toUpperCase() === 'SAVE500') {
          this.coupon = {
            code: 'SAVE500',
            discountType: 'fixed',
            discountValue: 500,
            minOrderAmount: 2000,
            isValid: true,
          }
          return true
        }

        throw new Error('Invalid coupon code')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Remove coupon
     */
    removeCoupon() {
      this.coupon = null
    },

    /**
     * Clear entire cart
     */
    clearCart() {
      this.items = []
      this.coupon = null
      secureStorage.remove(STORAGE_KEYS.cartItems)
    },
  },
})
