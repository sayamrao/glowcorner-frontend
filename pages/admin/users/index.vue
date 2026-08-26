<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { listAdminUsers } from '~/services/commerce'

const authStore = useAuthStore()
const users = ref<any[]>([])
const apiError = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    users.value = await listAdminUsers()
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load users from API'
    // Fallback to mock data structure
    users.value = [
      { id: '1', name: 'Ali Khan', email: 'ali@example.com', role: 'customer', status: 'Active', joinedAt: '2026-06-21' },
      { id: '2', name: 'Kidz Haven', email: 'seller@example.com', role: 'seller', status: 'Active', joinedAt: '2026-06-15' },
      { id: '3', name: 'Zara Noor', email: 'zara@example.com', role: 'customer', status: 'Suspended', joinedAt: '2026-05-10' },
    ]
  } finally {
    isLoading.value = false
  }
})

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'seller': return 'brand'
    case 'customer': return 'neutral'
    default: return 'neutral'
  }
}

useHead({
  title: 'Users & Sellers - Admin Console',
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
          <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">🌍</span> Platform Overview
          </NuxtLink>
          <NuxtLink to="/admin/users" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white font-medium transition-colors">
            <span class="text-lg">👥</span> Users & Sellers
          </NuxtLink>
          <NuxtLink to="/admin/moderation" class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <div class="flex items-center gap-3">
               <span class="text-lg">🛡️</span> Moderation
            </div>
            <span class="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
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
            <h1 class="text-2xl font-bold">Users & Sellers</h1>
            <p class="text-surface-500">Manage platform users, roles, and access</p>
          </div>
          <UiButton variant="primary">Add New User</UiButton>
        </div>

        <div v-if="apiError" class="mb-4 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local fallback.
        </div>

        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="p-4 border-b border-surface-200 dark:border-surface-800 flex gap-4">
            <input type="text" placeholder="Search users by name or email..." class="flex-grow px-4 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
            <select class="px-4 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all">
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 text-sm font-medium text-surface-500">
                  <th class="py-4 px-6">Name</th>
                  <th class="py-4 px-6">Email</th>
                  <th class="py-4 px-6">Role</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6">Joined Date</th>
                  <th class="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-800">
                <tr v-for="user in users" :key="user.id" class="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                  <td class="py-4 px-6 font-medium">{{ user.name }}</td>
                  <td class="py-4 px-6 text-surface-500">{{ user.email }}</td>
                  <td class="py-4 px-6">
                    <UiBadge :variant="getRoleBadge(user.role)" size="sm" class="capitalize">
                      {{ user.role }}
                    </UiBadge>
                  </td>
                  <td class="py-4 px-6">
                    <span :class="user.status === 'Active' ? 'text-success-600' : 'text-danger-600'" class="font-medium text-sm flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full" :class="user.status === 'Active' ? 'bg-success-500' : 'bg-danger-500'"></span>
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6">{{ new Date(user.joinedAt).toLocaleDateString() }}</td>
                  <td class="py-4 px-6 text-right">
                    <button class="text-brand-600 hover:text-brand-700 font-medium text-sm mr-3">Edit</button>
                    <button v-if="user.status === 'Active'" class="text-warning-600 hover:text-warning-700 font-medium text-sm">Suspend</button>
                    <button v-else class="text-success-600 hover:text-success-700 font-medium text-sm">Activate</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
