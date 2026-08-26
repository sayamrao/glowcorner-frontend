<script setup lang="ts">
interface ProductFormModel {
  base_price: number
  compare_at_price: number | null
  total_inventory: number

  status: string
  is_featured: boolean
}

const model = defineModel<ProductFormModel>({
  required: true,
})

defineProps<{
  hasVariants?: boolean
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
  >
    <div class="mb-6">
      <h2 class="text-lg font-semibold">
        Pricing
      </h2>

      <p class="text-sm text-surface-500 mt-1">
        Configure product pricing and publication settings.
      </p>
    </div>

    <div class="space-y-6">

      <!-- Prices -->

      <div class="grid md:grid-cols-2 gap-6">

        <div>
          <label class="block text-sm font-medium mb-2">
            Base Price
          </label>

          <input
            v-model.number="model.base_price"
            type="number"
            min="0"
            step="0.01"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
          />

          <p class="text-xs text-surface-500 mt-2">
            Used as the default product price.
          </p>

        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            Compare At Price
          </label>

          <input
            v-model.number="model.compare_at_price"
            type="number"
            min="0"
            step="0.01"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
          />

          <p class="text-xs text-surface-500 mt-2">
            Original price before discount.
          </p>

        </div>

      </div>

      <!-- Stock -->

      <div>
        <label class="block text-sm font-medium mb-2">
          Stock
        </label>

        <input
          v-model.number="model.total_inventory"
          type="number"
          min="0"
          step="1"
          :disabled="hasVariants"
          class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none md:max-w-xs disabled:bg-surface-100 disabled:text-surface-500 disabled:cursor-not-allowed dark:disabled:bg-surface-800"
        />

        <p class="text-xs text-surface-500 mt-2">
          {{
            hasVariants
              ? "Calculated from variant inventory when variants are present."
              : "Total units available for this product."
          }}
        </p>
      </div>

      <!-- Status -->

      <div class="grid md:grid-cols-2 gap-6">

        <div>

          <label class="block text-sm font-medium mb-2">
            Status
          </label>

          <select
            v-model="model.status"
            class="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3"
          >
            <option value="draft">
              Draft
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>

        <!-- Featured -->

        <div class="flex items-center mt-8">

          <input
            id="featured"
            v-model="model.is_featured"
            type="checkbox"
            class="h-5 w-5 rounded border-surface-300"
          />

          <label
            for="featured"
            class="ml-3"
          >
            Feature this product
          </label>

        </div>

      </div>

    </div>

  </div>
</template>