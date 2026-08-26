<script setup lang="ts">
import VariantCard from "./VariantCard.vue"

export interface VariantForm {
  sku: string
  name: string

  price: number
  compare_at_price: number | null

  inventory_quantity: number
  low_stock_threshold: number

  is_active: boolean

  attributes: Record<string, string>
}

const props = defineProps<{
  variants: VariantForm[]
}>()

const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
  >
    <!-- Header -->

    <div class="flex items-center justify-between mb-6">

      <div>
        <h2 class="text-lg font-semibold">
          Product Variants
        </h2>

        <p class="text-sm text-surface-500 mt-1">
          Add different variations of this product such as size, color or
          storage.
        </p>
      </div>

      <UiButton
        type="button"
        variant="primary"
        @click="emit('add')"
      >
        + Add Variant
      </UiButton>

    </div>

    <!-- Empty State -->

    <div
      v-if="variants.length === 0"
      class="rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-700 py-14 text-center"
    >
      <div class="text-5xl mb-4">
        📦
      </div>

      <h3 class="font-semibold text-lg">
        No variants added
      </h3>

      <p class="text-surface-500 mt-2">
        Every product must have at least one variant.
      </p>

      <UiButton
        class="mt-6"
        variant="primary"
        type="button"
        @click="emit('add')"
      >
        Create First Variant
      </UiButton>
    </div>

    <!-- Variant List -->

    <div
      v-else
      class="space-y-6"
    >
      <VariantCard
        v-for="(variant, index) in variants"
        :key="index"
        :variant="variant"
        :index="index"
        @remove="emit('remove', index)"
      />
    </div>

  </div>
</template>