<script setup lang="ts">
import type {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from '~/types'

const props = withDefaults(
  defineProps<{
    category?: Category | null
    categories?: Category[]
    loading?: boolean
    submitLabel?: string
  }>(),
  {
    category: null,
    categories: () => [],
    loading: false,
    submitLabel: 'Save Category',
  },
)

const emit = defineEmits<{
  submit: [
    payload: CategoryCreatePayload | CategoryUpdatePayload
  ]
  cancel: []
}>()

const form = reactive({
  name: '',
  slug: '',
  description: '',
  parent_id: '',
  sort_order: 0,
  image_url: '',
  is_active: true,
})

const errors = reactive<Record<string, string>>({})

const slugManuallyEdited = ref(false)

watch(
  () => props.category,
  (category) => {
    if (!category) {
      form.name = ''
      form.slug = ''
      form.description = ''
      form.parent_id = ''
      form.sort_order = 0
      form.image_url = ''
      form.is_active = true
      slugManuallyEdited.value = false
      return
    }

    form.name = category.name
    form.slug = category.slug
    form.description = category.description || ''
    form.parent_id = category.parentId || ''
    form.sort_order = category.sortOrder ?? 0
    form.image_url = category.imageUrl || ''
    form.is_active = category.isActive

    slugManuallyEdited.value = true
  },
  { immediate: true },
)

const generateSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

watch(
  () => form.name,
  (name) => {
    if (!slugManuallyEdited.value) {
      form.slug = generateSlug(name)
    }
  },
)

const handleSlugInput = () => {
  slugManuallyEdited.value = true
  form.slug = generateSlug(form.slug)
}

const validate = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  if (!form.name.trim()) {
    errors.name = 'Category name is required'
  }

  if (!form.slug.trim()) {
    errors.slug = 'Slug is required'
  }

  if (form.sort_order < 0) {
    errors.sort_order = 'Sort order cannot be negative'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = () => {
  if (!validate()) {
    return
  }

  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || null,
    parent_id: form.parent_id || null,
    sort_order: Number(form.sort_order) || 0,
    image_url: form.image_url.trim() || null,
    is_active: form.is_active,
  }

  emit('submit', payload)
}
</script>

<template>
  <form
    class="space-y-8"
    @submit.prevent="handleSubmit"
  >
    <!-- Basic Information -->
    <div
      class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6"
    >
      <div class="mb-6">
        <h2 class="text-lg font-semibold">
          Basic Information
        </h2>

        <p class="text-sm text-surface-500 mt-1">
          Configure the category name and URL.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Category Name
            <span class="text-danger-500">*</span>
          </label>

          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Educational Toys"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
            :class="{ 'border-danger-500': errors.name }"
          />

          <p
            v-if="errors.name"
            class="mt-1 text-sm text-danger-500"
          >
            {{ errors.name }}
          </p>
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Slug
            <span class="text-danger-500">*</span>
          </label>

          <input
            v-model="form.slug"
            type="text"
            placeholder="educational-toys"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
            :class="{ 'border-danger-500': errors.slug }"
            @input="handleSlugInput"
          />

          <p class="mt-1 text-xs text-surface-500">
            Used in the category URL.
          </p>

          <p
            v-if="errors.slug"
            class="mt-1 text-sm text-danger-500"
          >
            {{ errors.slug }}
          </p>
        </div>

        <!-- Parent -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Parent Category
          </label>

          <select
            v-model="form.parent_id"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">
              No Parent — Top Level
            </option>

            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              :disabled="category.id === props.category?.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Sort Order
          </label>

          <input
            v-model.number="form.sort_order"
            type="number"
            min="0"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
            :class="{ 'border-danger-500': errors.sort_order }"
          />

          <p class="mt-1 text-xs text-surface-500">
            Lower numbers appear first.
          </p>
        </div>
      </div>

      <!-- Description -->
      <div class="mt-6">
        <label class="block text-sm font-medium mb-2">
          Description
        </label>

        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Describe this category..."
          class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>
    </div>

    <!-- Image -->
    <div
      class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6"
    >
      <div class="mb-6">
        <h2 class="text-lg font-semibold">
          Category Image
        </h2>

        <p class="text-sm text-surface-500 mt-1">
          Provide the URL of the category image.
        </p>
      </div>

      <input
        v-model="form.image_url"
        type="url"
        placeholder="https://example.com/category.jpg"
        class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
      />

      <div
        v-if="form.image_url"
        class="mt-4 w-40 h-32 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-100"
      >
        <img
          :src="form.image_url"
          alt="Category preview"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
    </div>

    <!-- Status -->
    <div
      class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold">
            Category Status
          </h2>

          <p class="text-sm text-surface-500 mt-1">
            Inactive categories won't be shown to customers.
          </p>
        </div>

        <label class="relative inline-flex items-center cursor-pointer">
          <input
            v-model="form.is_active"
            type="checkbox"
            class="sr-only peer"
          />

          <div
            class="w-12 h-7 bg-surface-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500 rounded-full peer dark:bg-surface-700 peer-checked:bg-brand-600 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:after:translate-x-5"
          />
        </label>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3">
      <UiButton
        type="button"
        variant="outline"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Cancel
      </UiButton>

      <UiButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading"
      >
        {{ submitLabel }}
      </UiButton>
    </div>
  </form>
</template>