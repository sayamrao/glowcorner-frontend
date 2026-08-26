<script setup lang="ts">
import type {
  Category,
  CategoryUpdatePayload,
} from '~/types'

import {
  getCategory,
  listCategories,
  updateCategory,
  deleteCategory,
} from '~/services/category'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const category = ref<Category | null>(null)
const categories = ref<Category[]>([])

const isLoading = ref(true)
const isSubmitting = ref(false)
const isDeleting = ref(false)

const apiError = ref('')

const deleteModalOpen = ref(false)

const categoryId = computed(() =>
  String(route.params.id),
)

useHead({
  title: 'Edit Category - Admin',
})

const fetchCategory = async () => {
  isLoading.value = true
  apiError.value = ''

  try {
    const [categoryResult, categoriesResult] =
      await Promise.all([
        getCategory(categoryId.value),
        listCategories(false),
      ])

    category.value = categoryResult
    categories.value = categoriesResult
  } catch (error: any) {
    console.error('Failed to load category:', error)

    apiError.value =
      error?.response?.data?.message ||
      error?.message ||
      'Could not load category.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCategory)

const handleSubmit = async (
  payload: CategoryUpdatePayload,
) => {
  if (!category.value) return

  isSubmitting.value = true
  apiError.value = ''

  try {
    const updated = await updateCategory(
      category.value.id,
      payload,
    )

    category.value = updated

    toast.success(
      'Category updated',
      'The category was updated successfully.',
    )

    await router.push('/admin/categories')
  } catch (error: any) {
    console.error('Failed to update category:', error)

    apiError.value =
      error?.response?.data?.message ||
      error?.message ||
      'Could not update category.'
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!category.value) return

  isDeleting.value = true

  try {
    await deleteCategory(category.value.id)

    toast.success(
      'Category deleted',
      'The category was deleted successfully.',
    )

    await router.push('/admin/categories')
  } catch (error: any) {
    console.error('Failed to delete category:', error)

    apiError.value =
      error?.response?.data?.message ||
      error?.message ||
      'Could not delete category.'
  } finally {
    isDeleting.value = false
    deleteModalOpen.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/categories')
}
</script>

<template>
  <div class="container-app py-8">
    <div class="max-w-4xl mx-auto space-y-8">

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="space-y-6"
      >
        <div class="h-8 w-64 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />

        <div class="h-96 bg-surface-100 dark:bg-surface-800 rounded-2xl animate-pulse" />
      </div>

      <!-- Error -->
      <div
        v-else-if="apiError && !category"
        class="space-y-4"
      >
        <h1 class="text-2xl font-bold">
          Unable to load category
        </h1>

        <div class="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {{ apiError }}
        </div>

        <UiButton
          variant="outline"
          @click="fetchCategory"
        >
          Try Again
        </UiButton>
      </div>

      <!-- Form -->
      <template v-else-if="category">

        <div>
          <button
            class="text-sm text-surface-500 hover:text-brand-600 mb-4"
            @click="handleCancel"
          >
            ← Back to Categories
          </button>

          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold">
                Edit Category
              </h1>

              <p class="text-surface-500 mt-1">
                Update {{ category.name }} settings.
              </p>
            </div>

            <UiButton
              variant="danger"
              :disabled="isDeleting"
              @click="deleteModalOpen = true"
            >
              Delete
            </UiButton>
          </div>
        </div>

        <div
          v-if="apiError"
          class="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
        >
          {{ apiError }}
        </div>

        <CategoryForm
          :category="category"
          :categories="categories"
          :loading="isSubmitting"
          submit-label="Save Changes"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />

      </template>

    </div>

    <!-- Delete confirmation -->
    <UiModal
      :open="deleteModalOpen"
      title="Delete Category"
      @close="deleteModalOpen = false"
    >
      <div class="space-y-5">
        <p class="text-surface-600 dark:text-surface-300">
          Are you sure you want to delete
          <strong>{{ category?.name }}</strong>?
        </p>

        <p class="text-sm text-danger-600">
          This action cannot be undone.
        </p>

        <div class="flex justify-end gap-3">
          <UiButton
            variant="outline"
            :disabled="isDeleting"
            @click="deleteModalOpen = false"
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