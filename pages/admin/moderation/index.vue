<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { listAdminModerationTasks } from '~/services/commerce'

const authStore = useAuthStore()
const tasks = ref<any[]>([])
const apiError = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    tasks.value = await listAdminModerationTasks()
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load moderation tasks from API'
    // Fallback to mock data structure
    tasks.value = [
      { id: 'MOD-001', type: 'Seller Approval', subject: 'Kidz Haven', date: '2026-06-21', status: 'Pending', priority: 'High' },
      { id: 'MOD-002', type: 'Product Review', subject: 'Suspicious RC Toy', date: '2026-06-20', status: 'Pending', priority: 'Medium' },
      { id: 'MOD-003', type: 'Reported User', subject: 'Spam Account', date: '2026-06-19', status: 'In Progress', priority: 'Low' },
    ]
  } finally {
    isLoading.value = false
  }
})

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'danger'
    case 'Medium': return 'warning'
    case 'Low': return 'neutral'
    default: return 'neutral'
  }
}

useHead({
  title: 'Moderation - Admin Console',
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
          <NuxtLink to="/admin/users" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">👥</span> Users & Sellers
          </NuxtLink>
          <NuxtLink to="/admin/moderation" class="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white font-medium transition-colors">
            <div class="flex items-center gap-3">
               <span class="text-lg">🛡️</span> Moderation
            </div>
            <span class="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ tasks.length }}</span>
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
            <h1 class="text-2xl font-bold">Moderation Queue</h1>
            <p class="text-surface-500">Review pending seller approvals and reports</p>
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
                  <th class="py-4 px-6">Task ID</th>
                  <th class="py-4 px-6">Type</th>
                  <th class="py-4 px-6">Subject</th>
                  <th class="py-4 px-6">Date</th>
                  <th class="py-4 px-6">Priority</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-800">
                <tr v-for="task in tasks" :key="task.id" class="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                  <td class="py-4 px-6 font-medium font-mono text-xs">{{ task.id }}</td>
                  <td class="py-4 px-6">{{ task.type }}</td>
                  <td class="py-4 px-6 font-medium">{{ task.subject }}</td>
                  <td class="py-4 px-6">{{ new Date(task.date).toLocaleDateString() }}</td>
                  <td class="py-4 px-6">
                    <UiBadge :variant="getPriorityColor(task.priority)" size="sm">
                      {{ task.priority }}
                    </UiBadge>
                  </td>
                  <td class="py-4 px-6">
                    <span class="text-surface-600 dark:text-surface-300">{{ task.status }}</span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button class="text-brand-600 hover:text-brand-700 font-medium text-sm mr-3">Review</button>
                    <button class="text-success-600 hover:text-success-700 font-medium text-sm">Approve</button>
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
