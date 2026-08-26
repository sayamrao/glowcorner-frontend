<script setup lang="ts">
import type {
  Category,
  CategoryCreatePayload,
} from '~/types'

import {
  listCategories,
  createCategory,
} from '~/services/category'

const router = useRouter()
const toast = useToast()

const categories = ref<Category[]>([])
const isLoadingCategories = ref(true)
const isSubmitting = ref(false)
const apiError = ref('')

useHead({
  title: 'Create Category - Admin',
})

const fetchCategories = async () => {
  try {
    categories.value = await listCategories(false)
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    isLoadingCategories.value = false
  }
}

onMounted(fetchCategories)

const handleSubmit = async (
  payload: Category,
) => {
  isSubmitting.value = true
  apiError.value = ''

  try {
    await createCategory(payload)

    toast.success(
      'Category created',
      'The category was created successfully.',
    )

    await router.push('/admin/categories')
  } catch (error: any) {
    console.error('Failed to create category:', error)

    apiError.value =
      error?.response?.data?.message ||
      error?.message ||
      'Could not create category.'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/categories')
}
</script>

<template>
  <div class="container-app py-8">
    <div class="max-w-4xl mx-auto space-y-8">

      <!-- Header -->
      <div>
        <button
          class="text-sm text-surface-500 hover:text-brand-600 mb-4"
          @click="handleCancel"
        >
          ← Back to Categories
        </button>

        <h1 class="text-2xl font-bold">
          Create Category
        </h1>

        <p class="text-surface-500 mt-1">
          Add a new category to your product catalog.
        </p>
      </div>

      <!-- Error -->
      <div
        v-if="apiError"
        class="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
      >
        {{ apiError }}
      </div>

      <!-- Form -->
      <CategoryForm
        :categories="categories"
        :loading="isSubmitting || isLoadingCategories"
        submit-label="Create Category"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>