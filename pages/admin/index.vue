<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { mockAdminStats } from '~/services/mockData'
import { formatPrice } from '~/utils'
import { getAdminStats } from '~/services/commerce'

const authStore = useAuthStore()
const stats = ref(mockAdminStats)
const apiError = ref('')

onMounted(async () => {
  try {
    stats.value = await getAdminStats()
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load admin metrics from API'
    stats.value = mockAdminStats
  }
})

useHead({
  title: 'Admin Console',
})
</script>

<template>
  <div class="container-app py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 shrink-0">
        <div class="bg-surface-900 text-white rounded-2xl p-6 mb-6">
          <p class="text-surface-400 text-xs tracking-wider uppercase mb-1">System Admin</p>
          <h2 class="font-bold text-xl mb-4">{{ authStore.userName }}</h2>
          <UiBadge variant="danger" size="sm" class="border-none uppercase tracking-wide">Root Access</UiBadge>
        </div>

        <nav class="space-y-1">
          <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white font-medium transition-colors">
            <span class="text-lg">🌍</span> Platform Overview
          </NuxtLink>
          <NuxtLink to="/admin/users" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">👥</span> Users & Sellers
          </NuxtLink>
          <NuxtLink to="/admin/moderation" class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <div class="flex items-center gap-3">
               <span class="text-lg">🛡️</span> Moderation
            </div>
            <span class="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ stats.pendingApprovals }}</span>
          </NuxtLink>
          <button @click="authStore.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-50 text-danger-600 dark:hover:bg-danger-900/20 dark:text-danger-400 transition-colors text-left mt-4 border-t border-surface-200 dark:border-surface-800 rounded-t-none">
            <span class="text-lg">🚪</span> Log Out
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Platform Metrics</h1>
        </div>

        <div v-if="apiError" class="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local metrics fallback.
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm">
            <p class="text-surface-500 text-sm mb-2">Total GMV</p>
            <p class="text-2xl font-bold text-success-600 dark:text-success-500">{{ formatPrice(stats.totalRevenue) }}</p>
          </div>
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm">
            <p class="text-surface-500 text-sm mb-2">Total Orders</p>
            <p class="text-2xl font-bold">{{ stats.totalOrders.toLocaleString() }}</p>
          </div>
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm">
            <p class="text-surface-500 text-sm mb-2">Active Users</p>
            <p class="text-2xl font-bold">{{ stats.totalUsers.toLocaleString() }}</p>
          </div>
          <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm">
            <p class="text-surface-500 text-sm mb-2">Registered Sellers</p>
            <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ stats.totalSellers }}</p>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
          <h2 class="text-lg font-bold mb-4">System Health</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-success-50 dark:bg-success-900/20 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-success-500 animate-pulse"></span>
                <span class="font-medium text-success-700 dark:text-success-400">API Gateway (FastAPI)</span>
              </div>
              <span class="text-sm font-mono text-success-600">Operational — 99.9% Uptime</span>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-success-50 dark:bg-success-900/20 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-success-500 animate-pulse"></span>
                <span class="font-medium text-success-700 dark:text-success-400">Database Cluster</span>
              </div>
              <span class="text-sm font-mono text-success-600">Operational — 24ms latency</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-warning-50 dark:bg-warning-900/20 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-warning-500"></span>
                <span class="font-medium text-warning-700 dark:text-warning-400">Image Processing Queue</span>
              </div>
              <span class="text-sm font-mono text-warning-600">High Load — 12 pending</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
