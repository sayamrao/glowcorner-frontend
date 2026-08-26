<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { mockOrders } from '~/services/mockData'
import { formatPrice } from '~/utils'
import { ORDER_STATUS_LABELS } from '~/constants'
import { listOrders } from '~/services/commerce'

const authStore = useAuthStore()
const orders = ref([])
const isLoading = ref(false)
const apiError = ref('')

async function fetchOrders() {
  isLoading.value = true
  apiError.value = ''
  try {
    const response = await listOrders()
    orders.value = response.data
    console.log("Order response: ", orders.value)
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load orders from API'
    orders.value = mockOrders
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchOrders)

useHead({
  title: 'My Orders',
})
</script>

<template>
  <div class="container-app py-8">
    <div class="flex flex-col md:flex-row gap-8">
      
      <!-- Sidebar (Same as dashboard) -->
      <aside class="w-full md:w-64 shrink-0">
        <div class="bg-surface-50 dark:bg-surface-900 rounded-2xl p-6 mb-6 text-center">
          <div class="w-20 h-20 mx-auto rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold mb-4">
            {{ authStore.userInitials }}
          </div>
          <h2 class="font-bold text-lg mb-1">{{ authStore.userName }}</h2>
          <p class="text-sm text-surface-500">{{ authStore.user?.email }}</p>
        </div>

        <nav class="space-y-1">
          <NuxtLink to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">📊</span> Overview
          </NuxtLink>
          <NuxtLink to="/dashboard/orders" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium transition-colors">
            <span class="text-lg">📦</span> My Orders
          </NuxtLink>
          <NuxtLink to="/dashboard/wishlist" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">❤️</span> Wishlist
          </NuxtLink>
          <NuxtLink to="/dashboard/addresses" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">📍</span> Addresses
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow space-y-6">
        <h1 class="text-2xl font-bold">Order History</h1>

        <div v-if="apiError" class="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local order fallback.
        </div>

        <div v-if="isLoading" class="space-y-4">
          <UiSkeleton v-for="item in 3" :key="item" class="h-48 rounded-2xl" />
        </div>

        <div v-else-if="orders.length === 0" class="bg-surface-50 dark:bg-surface-900 rounded-2xl p-12 text-center">
          <div class="text-4xl mb-4">🛍️</div>
          <h2 class="text-xl font-bold mb-2">No orders yet</h2>
          <p class="text-surface-500 mb-6">When you place orders, they will appear here.</p>
          <NuxtLink to="/products">
            <UiButton>Start Shopping</UiButton>
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden">
            <!-- Order Header -->
            <div class="bg-surface-50 dark:bg-surface-800/50 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 dark:border-surface-800">
              <div class="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div>
                  <p class="text-xs text-surface-500 mb-1">Order Placed</p>
                  <p class="font-medium text-sm">{{ new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                </div>
                <div>
                  <p class="text-xs text-surface-500 mb-1">Total Amount</p>
                  <p class="font-medium text-sm text-brand-600 dark:text-brand-400">{{ formatPrice(order.total) }}</p>
                </div>
                <div>
                  <p class="text-xs text-surface-500 mb-1">Order Number</p>
                  <p class="font-medium text-sm">{{ order.orderNumber }}</p>
                </div>
              </div>
              
              <UiBadge :variant="ORDER_STATUS_LABELS[order.status].color as any" size="md">
                {{ ORDER_STATUS_LABELS[order.status].label }}
              </UiBadge>
            </div>

            <!-- Order Items -->
            <div class="p-4 sm:p-6 space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex gap-4">
                <div class="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-xl overflow-hidden shrink-0">
                  <img :src="item.productImage" :alt="item.productName" class="w-full h-full object-cover" />
                </div>
                <div class="flex-grow min-w-0 flex flex-col justify-center">
                  <h4 class="font-medium text-surface-900 dark:text-white line-clamp-1">{{ item.productName }}</h4>
                  <p v-if="item.variantName" class="text-sm text-surface-500 mb-2">{{ item.variantName }}</p>
                  <div class="flex items-center gap-4 text-sm mt-auto">
                    <span class="font-medium">{{ formatPrice(item.price) }}</span>
                    <span class="text-surface-400">Qty: {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="hidden sm:flex shrink-0 items-center">
                  <UiButton variant="outline" size="sm">Write Review</UiButton>
                </div>
              </div>
            </div>
            
            <div class="bg-surface-50/50 dark:bg-surface-800/30 p-4 border-t border-surface-200 dark:border-surface-800 flex justify-between sm:justify-end gap-3">
              <UiButton variant="outline" size="sm">Track Order</UiButton>
              <UiButton variant="secondary" size="sm">View Invoice</UiButton>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
