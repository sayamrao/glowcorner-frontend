<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { formatPrice } from '~/utils'
import { listSellerOrders } from '~/services/commerce'
import type { Order } from '~/types'

const authStore = useAuthStore()
const orders = ref<Order[]>([])
const apiError = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    orders.value = await listSellerOrders()
    console.log("Orders: ", orders.value)
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load orders from API'
    // Fallback to mock data structure
    orders.value = [
      { id: 'ORD-1001', customerName: 'Ali Khan', date: '2026-06-21', total: 4500, status: 'pending' },
      { id: 'ORD-1002', customerName: 'Ayesha Ahmed', date: '2026-06-20', total: 1200, status: 'processing' },
      { id: 'ORD-1003', customerName: 'Bilal Tariq', date: '2026-06-19', total: 8500, status: 'shipped' },
      { id: 'ORD-1004', customerName: 'Zara Noor', date: '2026-06-18', total: 3200, status: 'delivered' },
    ] as any
  } finally {
    isLoading.value = false
  }
})

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'warning'
    case 'processing': return 'brand'
    case 'shipped': return 'success'
    case 'delivered': return 'neutral'
    default: return 'neutral'
  }
}

const selectedOrder = ref<Order | null>(null)
const showOrderDetails = ref(false)

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const closeOrderDetails = () => {
  showOrderDetails.value = false
  selectedOrder.value = null
}

useHead({
  title: 'My Orders - Seller Dashboard',
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
          <NuxtLink to="/seller" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">📈</span> Dashboard
          </NuxtLink>
          <NuxtLink to="/seller/products" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">🛍️</span> Products
          </NuxtLink>
          <NuxtLink to="/seller/orders" class="flex items-center justify-between px-4 py-3 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium transition-colors">
            <div class="flex items-center gap-3">
               <span class="text-lg">📦</span> Orders
            </div>
            <span class="bg-danger-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span>
          </NuxtLink>
          <button @click="authStore.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-50 text-danger-600 dark:hover:bg-danger-900/20 dark:text-danger-400 transition-colors text-left mt-4 border-t border-surface-200 dark:border-surface-800 rounded-t-none">
            <span class="text-lg">🚪</span> Log Out
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Manage Orders</h1>
            <p class="text-surface-500">View and fulfill customer orders</p>
          </div>
        </div>

        <div v-if="apiError" class="mb-4 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local fallback.
        </div>

        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 text-sm font-medium text-surface-500">
                  <th class="py-4 px-6">Order ID</th>
                  <th class="py-4 px-6">Date</th>
                  <th class="py-4 px-6">Customer</th>
                  <th class="py-4 px-6">Total</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-800">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                  <td class="py-4 px-6 font-medium text-brand-600 dark:text-brand-400">{{ (order as any).orderNumber || order.id }}</td>
                  <td class="py-4 px-6">{{ new Date((order as any).date || order.createdAt).toLocaleDateString() }}</td>
                  <td class="py-4 px-6">{{ (order as any).customerName || 'Customer' }}</td>
                  <td class="py-4 px-6 font-bold">{{ formatPrice(order.totalAmount) }}</td>
                  <td class="py-4 px-6">
                    <UiBadge :variant="getStatusColor(order.status)" size="sm" class="capitalize">
                      {{ order.status }}
                    </UiBadge>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button class="text-brand-600 hover:text-brand-700 font-medium text-sm" @click="viewOrderDetails(order)">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between text-sm text-surface-500">
            <span>Showing 1 to {{ orders.length }} of {{ orders.length }} entries</span>
            <div class="flex gap-2">
              <UiButton variant="outline" size="sm" disabled>Previous</UiButton>
              <UiButton variant="outline" size="sm" disabled>Next</UiButton>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <OrderDetailsModal :order="selectedOrder" :open="showOrderDetails" @close="closeOrderDetails" />
</template>
