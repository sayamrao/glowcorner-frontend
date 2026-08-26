<script setup lang="ts">
interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

interface ProductFormModel {
  name: string
  slug: string
  description: string
  short_description: string

  category_id: string | null
  brand_id: string | null
}

defineProps<{
  categories: Category[]
  brands: Brand[]
}>()

const model = defineModel<ProductFormModel>({
  required: true,
})
</script>

<template>
  <div
    class="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
  >
    <div class="mb-6">
      <h2 class="text-lg font-semibold">
        Basic Information
      </h2>

      <p class="text-sm text-surface-500 mt-1">
        Basic details about your product.
      </p>
    </div>

    <div class="space-y-6">

      <!-- Product Name -->

      <div>
        <label class="block mb-2 text-sm font-medium">
          Product Name
        </label>

        <input
          v-model="model.name"
          type="text"
          required
          placeholder="Wireless Bluetooth Headphones"
          class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <!-- Slug -->

      <div>
        <label class="block mb-2 text-sm font-medium">
          Slug
        </label>

        <input
          v-model="model.slug"
          readonly
          class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 px-4 py-3 text-surface-500 cursor-not-allowed"
        />

        <p class="text-xs text-surface-500 mt-2">
          Automatically generated from product name.
        </p>
      </div>

      <!-- Short Description -->

      <div>
        <label class="block mb-2 text-sm font-medium">
          Short Description
        </label>

        <textarea
          v-model="model.short_description"
          rows="2"
          maxlength="500"
          placeholder="Short summary shown on listing pages."
          class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 resize-none focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <!-- Description -->

      <div>
        <label class="block mb-2 text-sm font-medium">
          Description
        </label>

        <textarea
          v-model="model.description"
          rows="8"
          placeholder="Describe your product in detail..."
          class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 resize-y focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <!-- Category + Brand -->

      <div class="grid lg:grid-cols-2 gap-6">

        <!-- Category -->

        <div>
          <label class="block mb-2 text-sm font-medium">
            Category
          </label>

          <select
            v-model="model.category_id"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3"
          >
            <option :value="null">
              Select Category
            </option>

            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Brand -->

        <div>
          <label class="block mb-2 text-sm font-medium">
            Brand
          </label>

          <select
            v-model="model.brand_id"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3"
          >
            <option :value="null">
              Select Brand
            </option>

            <option
              v-for="brand in brands"
              :key="brand.id"
              :value="brand.id"
            >
              {{ brand.name }}
            </option>
          </select>
        </div>

      </div>

    </div>
  </div>
</template>