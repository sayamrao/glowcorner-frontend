<script setup lang="ts">
import type { Category } from '~/types'
import {
  listCategories,
  deleteCategory,
} from '~/services/category'

const router = useRouter()

const categories = ref<Category[]>([])
const isLoading = ref(true)
const apiError = ref('')

const search = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

const deleteModalOpen = ref(false)
const categoryToDelete = ref<Category | null>(null)
const isDeleting = ref(false)

const toast = useToast()

useHead({
  title: 'Categories - Admin',
})

const fetchCategories = async () => {
  isLoading.value = true
  apiError.value = ''

  try {
    categories.value = await listCategories(false)
  } catch (error: any) {
    console.error('Failed to fetch categories:', error)

    apiError.value =
      error?.response?.data?.message ||
      error?.message ||
      'Could not load categories'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCategories)

const filteredCategories = computed(() => {
  const query = search.value.trim().toLowerCase()

  return categories.value.filter((category) => {
    const matchesSearch =
      !query ||
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      category.description?.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active' && category.isActive) ||
      (statusFilter.value === 'inactive' && !category.isActive)

    return matchesSearch && matchesStatus
  })
})

const activeCount = computed(() =>
  categories.value.filter(category => category.isActive).length,
)

const inactiveCount = computed(() =>
  categories.value.filter(category => !category.isActive).length,
)

const openDeleteModal = (category: Category) => {
  categoryToDelete.value = category
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  if (isDeleting.value) return

  deleteModalOpen.value = false
  categoryToDelete.value = null
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return

  isDeleting.value = true

  try {
    await deleteCategory(categoryToDelete.value.id)

    categories.value = categories.value.filter(
      category => category.id !== categoryToDelete.value?.id,
    )

    toast.success(
      'Category deleted',
      'The category was removed successfully.',
    )

    closeDeleteModal()
  } catch (error: any) {
    console.error('Failed to delete category:', error)

    toast.error(
      'Delete failed',
      error?.response?.data?.message ||
        error?.message ||
        'Could not delete category.',
    )
  } finally {
    isDeleting.value = false
  }
}

const editCategory = (category: Category) => {
  router.push(`/admin/categories/${category.id}/edit`)
}
</script>

<template>
  <div class="container-app py-8">
    <div class="space-y-8">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">
            Categories
          </h1>

          <p class="text-surface-500 mt-1">
            Manage your product categories and catalog structure.
          </p>
        </div>

        <UiButton
          variant="primary"
          @click="router.push('/seller/categories/new')"
        >
          + Add Category
        </UiButton>
      </div>

      <!-- Error -->
      <div
        v-if="apiError"
        class="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
      >
        <div class="flex items-center justify-between gap-4">
          <span>{{ apiError }}</span>

          <button
            class="font-medium underline"
            @click="fetchCategories"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5">
          <p class="text-sm text-surface-500">
            Total Categories
          </p>
          <p class="text-2xl font-bold mt-1">
            {{ categories.length }}
          </p>
        </div>

        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5">
          <p class="text-sm text-surface-500">
            Active
          </p>
          <p class="text-2xl font-bold text-success-600 mt-1">
            {{ activeCount }}
          </p>
        </div>

        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5">
          <p class="text-sm text-surface-500">
            Inactive
          </p>
          <p class="text-2xl font-bold text-surface-500 mt-1">
            {{ inactiveCount }}
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-4">
        <div class="flex flex-col md:flex-row gap-4">

          <div class="flex-1">
            <input
              v-model="search"
              type="search"
              placeholder="Search categories..."
              class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            v-model="statusFilter"
            class="rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">
              All Categories
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <UiButton
            variant="outline"
            :disabled="isLoading"
            @click="fetchCategories"
          >
            Refresh
          </UiButton>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden shadow-sm">

        <!-- Loading -->
        <div
          v-if="isLoading"
          class="p-8 space-y-4"
        >
          <div
            v-for="i in 5"
            :key="i"
            class="h-16 rounded-xl bg-surface-100 dark:bg-surface-800 animate-pulse"
          />
        </div>

        <!-- Empty -->
        <div
          v-else-if="filteredCategories.length === 0"
          class="py-16 px-6 text-center"
        >
          <div class="text-5xl mb-4">
            🗂️
          </div>

          <h3 class="text-lg font-semibold">
            No categories found
          </h3>

          <p class="text-surface-500 mt-1">
            {{
              search
                ? 'Try changing your search criteria.'
                : 'Create your first category to get started.'
            }}
          </p>

          <UiButton
            v-if="!search"
            variant="primary"
            class="mt-6"
            @click="router.push('/admin/categories/new')"
          >
            Create Category
          </UiButton>
        </div>

        <!-- Desktop table -->
        <div
          v-else
          class="overflow-x-auto"
        >
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 text-sm font-medium text-surface-500">
                <th class="py-4 px-6">
                  Category
                </th>

                <th class="py-4 px-6">
                  Slug
                </th>

                <th class="py-4 px-6">
                  Parent
                </th>

                <th class="py-4 px-6">
                  Sort Order
                </th>

                <th class="py-4 px-6">
                  Status
                </th>

                <th class="py-4 px-6 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-surface-200 dark:divide-surface-800">
              <tr
                v-for="category in filteredCategories"
                :key="category.id"
                class="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors"
              >
                <!-- Category -->
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">

                    <div
                      v-if="category.imageUrl"
                      class="w-12 h-12 rounded-xl overflow-hidden bg-surface-100 shrink-0"
                    >
                      <img
                        :src="category.imageUrl"
                        :alt="category.name"
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <div
                      v-else
                      class="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-xl shrink-0"
                    >
                      🗂️
                    </div>

                    <div>
                      <p class="font-medium">
                        {{ category.name }}
                      </p>

                      <p
                        v-if="category.description"
                        class="text-xs text-surface-500 max-w-xs truncate"
                      >
                        {{ category.description }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Slug -->
                <td class="py-4 px-6">
                  <code class="text-sm text-surface-600 dark:text-surface-300">
                    {{ category.slug }}
                  </code>
                </td>

                <!-- Parent -->
                <td class="py-4 px-6">
                  {{
                    categories.find(
                      parent => parent.id === category.parentId,
                    )?.name || 'Top Level'
                  }}
                </td>

                <!-- Sort -->
                <td class="py-4 px-6">
                  {{ category.sortOrder }}
                </td>

                <!-- Status -->
                <td class="py-4 px-6">
                  <UiBadge
                    :variant="category.isActive ? 'success' : 'neutral'"
                    size="sm"
                  >
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </UiBadge>
                </td>

                <!-- Actions -->
                <td class="py-4 px-6">
                  <div class="flex items-center justify-end gap-2">

                    <button
                      class="px-3 py-2 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                      @click="editCategory(category)"
                    >
                      Edit
                    </button>

                    <button
                      class="px-3 py-2 rounded-lg text-sm font-medium text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                      @click="openDeleteModal(category)"
                    >
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Delete Modal -->
    <UiModal
      :open="deleteModalOpen"
      title="Delete Category"
      @close="closeDeleteModal"
    >
      <div class="space-y-5">
        <p class="text-surface-600 dark:text-surface-300">
          Are you sure you want to delete
          <strong>{{ categoryToDelete?.name }}</strong>?
        </p>

        <p class="text-sm text-danger-600">
          This action cannot be undone.
        </p>

        <div class="flex justify-end gap-3">
          <UiButton
            variant="outline"
            :disabled="isDeleting"
            @click="closeDeleteModal"
          >
            Cancel
          </UiButton>

          <UiButton
            variant="danger"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            Delete Category
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>