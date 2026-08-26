<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Mock dashboard data
const stats = [
  { label: 'Total Orders', value: '12', icon: '📦' },
  { label: 'Wishlist Items', value: '4', icon: '❤️' },
  { label: 'Reviews Given', value: '8', icon: '⭐' },
]

useHead({
  title: 'My Dashboard',
})
</script>

<template>
  <div class="container-app py-8">
    <div class="flex flex-col md:flex-row gap-8">
      
      <!-- Sidebar -->
      <aside class="w-full md:w-64 shrink-0">
        <div class="bg-surface-50 dark:bg-surface-900 rounded-2xl p-6 mb-6 text-center">
          <div class="w-20 h-20 mx-auto rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold mb-4">
            {{ authStore.userInitials }}
          </div>
          <h2 class="font-bold text-lg mb-1">{{ authStore.userName }}</h2>
          <p class="text-sm text-surface-500">{{ authStore.user?.email }}</p>
        </div>

        <nav class="space-y-1">
          <NuxtLink to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium transition-colors">
            <span class="text-lg">📊</span> Overview
          </NuxtLink>
          <NuxtLink to="/dashboard/orders" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">📦</span> My Orders
          </NuxtLink>
          <NuxtLink to="/dashboard/wishlist" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">❤️</span> Wishlist
          </NuxtLink>
          <NuxtLink to="/dashboard/addresses" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">📍</span> Addresses
          </NuxtLink>
          <button @click="authStore.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-50 text-danger-600 dark:hover:bg-danger-900/20 dark:text-danger-400 transition-colors text-left mt-4">
            <span class="text-lg">🚪</span> Log Out
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow space-y-8">
        <h1 class="text-2xl font-bold">Dashboard Overview</h1>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-2xl">
              {{ stat.icon }}
            </div>
            <div>
              <p class="text-surface-500 text-sm mb-1">{{ stat.label }}</p>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity Mock -->
        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold">Recent Orders</h2>
            <NuxtLink to="/dashboard/orders" class="text-sm font-medium text-brand-600 hover:text-brand-700">View All</NuxtLink>
          </div>
          
          <div class="text-center py-8 text-surface-500">
            <p>Your recent orders will appear here.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
