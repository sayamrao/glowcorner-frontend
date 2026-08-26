import { defineStore } from 'pinia'
import type { WishlistItem, Product } from '~/types'
import { uid, secureStorage } from '~/utils'
interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
}

export const useWishlistStore = defineStore('wishlist', {
  state: (): WishlistState => ({
    items: [],
    isLoading: false,
  }),

  getters: {
    count: (state) => state.items.length,
    isInWishlist: (state) => (productId: string) =>
      state.items.some(item => item.productId === productId),
  },

  actions: {
    loadWishlist() {
      const stored = secureStorage.get('familycorner_wishlist')
      if (stored) {
        try {
          this.items = JSON.parse(stored)
        } catch {
          this.items = []
        }
      }
    },

    async toggleWishlist(product: Product) {
      const existing = this.items.find(item => item.productId === product.id)
      if (existing) {
        this.items = this.items.filter(item => item.productId !== product.id)
      } else {
        this.items.push({
          id: uid(),
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        })
      }
      secureStorage.set('familycorner_wishlist', JSON.stringify(this.items))
    },

    removeItem(productId: string) {
      this.items = this.items.filter(item => item.productId !== productId)
      secureStorage.set('familycorner_wishlist', JSON.stringify(this.items))
    },
  },
})
