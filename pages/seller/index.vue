<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { mockSellerStats } from '~/services/mockData'
import { formatPrice } from '~/utils'
import { getSellerStats } from '~/services/commerce'

const authStore = useAuthStore()
const stats = ref(mockSellerStats)
const apiError = ref('')

onMounted(async () => {
  try {
    stats.value = await getSellerStats()
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load seller metrics from API'
    stats.value = mockSellerStats
  }
})

useHead({
  title: 'Seller Dashboard',
})
</script>

<template>
  <div class="container-app py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 shrink-0">
        <div class="bg-brand-600 text-white rounded-2xl p-6 mb-6">
          <p class="text-brand-100 text-sm mb-1">Store Profile</p>
          <h2 class="font-bold text-xl mb-4">{{ authStore.userName }}</h2>
          <div class="flex gap-2">
            <UiBadge variant="neutral" class="!bg-white/20 !text-white border-none">Verified Seller</UiBadge>
          </div>
        </div>

        <nav class="space-y-1">
          <NuxtLink to="/seller" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium transition-colors">
            <span class="text-lg">📈</span> Dashboard
          </NuxtLink>
          <NuxtLink to="/seller/products" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">🛍️</span> Products
          </NuxtLink>
          <NuxtLink
            to="/seller/categories"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors"
            >
              <span class="text-lg">🗂️</span>
              Categories
          </NuxtLink>
          <NuxtLink to="/seller/orders" class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <div class="flex items-center gap-3">
               <span class="text-lg">📦</span> Orders
            </div>
            <span class="bg-danger-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ stats.pendingOrders }}</span>
          </NuxtLink>
          <button @click="authStore.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-50 text-danger-600 dark:hover:bg-danger-900/20 dark:text-danger-400 transition-colors text-left mt-4 border-t border-surface-200 dark:border-surface-800 rounded-t-none">
            <span class="text-lg">🚪</span> Log Out
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Store Overview</h1>
          <NuxtLink to="/seller/products/new">
            <UiButton variant="primary">Add New Product</UiButton>
          </NuxtLink>
        </div>

        <!-- KPIs -->
        <div v-if="apiError" class="mb-4 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local metrics fallback.
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
            <p class="text-surface-500 text-sm mb-2">Total Revenue</p>
            <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(stats.totalRevenue) }}</p>
          </div>
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
            <p class="text-surface-500 text-sm mb-2">Total Orders</p>
            <p class="text-2xl font-bold">{{ stats.totalOrders }}</p>
          </div>
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
            <p class="text-surface-500 text-sm mb-2">Active Products</p>
            <p class="text-2xl font-bold">{{ stats.totalProducts }}</p>
          </div>
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
            <p class="text-surface-500 text-sm mb-2">Store Rating</p>
            <p class="text-2xl font-bold flex items-center gap-2">
              {{ stats.averageRating }} <span class="text-amber-500">★</span>
            </p>
          </div>
        </div>

        <!-- Charts Placeholder -->
        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-surface-400">
           <span class="text-4xl mb-4">📊</span>
           <p>Sales Chart Visualization</p>
           <p class="text-sm">(Implementation requires chart.js or similar)</p>
        </div>
      </div>

    </div>
  </div>
</template>
