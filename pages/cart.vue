<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { formatPrice } from '~/utils'

const cartStore = useCartStore()
const couponCode = ref('')
const couponError = ref('')

function updateQuantity(id: string, qty: number) {
  cartStore.updateQuantity(id, qty)
}

function removeItem(id: string) {
  cartStore.removeItem(id)
}

async function applyCoupon() {
  if (!couponCode.value.trim()) return
  couponError.value = ''
  
  try {
    await cartStore.applyCoupon(couponCode.value.trim())
  } catch (err: any) {
    couponError.value = err.message || 'Invalid coupon'
  }
}

useHead({
  title: 'Shopping Cart',
})
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <h1 class="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-16 bg-surface-50 dark:bg-surface-900 rounded-3xl">
      <div class="w-24 h-24 mx-auto mb-6 bg-surface-200 dark:bg-surface-800 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
      </div>
      <h2 class="text-2xl font-bold mb-4">Your cart is empty</h2>
      <p class="text-surface-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
      <NuxtLink to="/products">
        <UiButton size="lg">Start Shopping</UiButton>
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cartStore.items" 
          :key="item.id"
          class="flex gap-4 p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800"
        >
          <!-- Image -->
          <NuxtLink :to="`/products/${item.productSlug}`" class="shrink-0">
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800">
              <img :src="item.productImage" :alt="item.productName" class="w-full h-full object-cover" />
            </div>
          </NuxtLink>

          <!-- Details -->
          <div class="flex flex-col flex-grow">
            <div class="flex justify-between items-start gap-4 mb-1">
              <NuxtLink :to="`/products/${item.productSlug}`" class="font-medium text-surface-900 dark:text-white hover:text-brand-600 line-clamp-2">
                {{ item.productName }}
              </NuxtLink>
              <button @click="removeItem(item.id)" class="text-surface-400 hover:text-danger-500 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div class="text-sm text-surface-500 mb-2">
              <span v-if="item.variantName">{{ item.variantName }}</span>
              <span v-if="item.variantName" class="mx-2">•</span>
              <span>{{ item.sellerName }}</span>
            </div>

            <div class="mt-auto flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(item.price) }}</span>
                <span v-if="item.compareAtPrice" class="text-xs text-surface-400 line-through">{{ formatPrice(item.compareAtPrice) }}</span>
              </div>

              <!-- Quantity Selector -->
              <div class="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden h-8">
                <button 
                  class="w-8 h-full flex items-center justify-center hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-50"
                  :disabled="item.quantity <= 1"
                  @click="updateQuantity(item.id, item.quantity - 1)"
                >-</button>
                <span class="w-10 text-center font-medium text-sm">{{ item.quantity }}</span>
                <button 
                  class="w-8 h-full flex items-center justify-center hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-50"
                  :disabled="item.quantity >= item.maxQuantity"
                  @click="updateQuantity(item.id, item.quantity + 1)"
                >+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-surface-50 dark:bg-surface-900 rounded-3xl p-6 lg:p-8 sticky top-24">
        <h2 class="text-xl font-bold mb-6">Order Summary</h2>

        <div class="space-y-4 mb-6 text-sm">
          <div class="flex justify-between">
            <span class="text-surface-600 dark:text-surface-400">Subtotal ({{ cartStore.itemCount }} items)</span>
            <span class="font-medium">{{ formatPrice(cartStore.subtotal) }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-surface-600 dark:text-surface-400">Shipping</span>
            <span class="font-medium" :class="{'text-success-600': cartStore.shipping === 0}">
              {{ cartStore.shipping === 0 ? 'Free' : formatPrice(cartStore.shipping) }}
            </span>
          </div>

          <div v-if="cartStore.discount > 0" class="flex justify-between text-success-600">
            <span>Discount ({{ cartStore.coupon?.code }})</span>
            <span class="font-medium">-{{ formatPrice(cartStore.discount) }}</span>
          </div>

          <div class="pt-4 border-t border-surface-200 dark:border-surface-800 flex justify-between items-center">
            <span class="font-bold text-base">Total</span>
            <span class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(cartStore.total) }}</span>
          </div>
        </div>

        <!-- Coupon -->
        <div class="mb-6">
          <div v-if="!cartStore.coupon" class="flex gap-2">
            <UiInput v-model="couponCode" placeholder="Promo code" class="flex-grow" :error="couponError" @keyup.enter="applyCoupon" />
            <UiButton variant="outline" :loading="cartStore.isLoading" @click="applyCoupon">Apply</UiButton>
          </div>
          <div v-else class="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl">
            <div class="flex items-center gap-2 text-success-700 dark:text-success-400 text-sm font-medium">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Code {{ cartStore.coupon.code }} applied
            </div>
            <button @click="cartStore.removeCoupon" class="text-success-600 hover:text-success-800 text-xs font-bold underline">Remove</button>
          </div>
        </div>

        <NuxtLink to="/checkout" class="block">
          <UiButton size="lg" fullWidth>Proceed to Checkout</UiButton>
        </NuxtLink>

        <p class="text-xs text-center text-surface-500 mt-4">
          Free shipping on orders over Rs. 3,000
        </p>
      </div>
    </div>
  </div>
</template>
