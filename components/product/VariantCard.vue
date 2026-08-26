<script setup lang="ts">
interface VariantForm {
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
  variant: VariantForm
  index: number
}>()

const emit = defineEmits<{
  remove: []
}>()

const attributeEntries = computed(() =>
  Object.entries(props.variant.attributes)
)

function addAttribute() {
  let counter = 1

  while (props.variant.attributes[`Attribute ${counter}`]) {
    counter++
  }

  props.variant.attributes[`Attribute ${counter}`] = ""
}

function removeAttribute(key: string) {
  delete props.variant.attributes[key]
}

function renameAttribute(oldKey: string, newKey: string) {
  if (!newKey || oldKey === newKey) return

  const value = props.variant.attributes[oldKey]

  delete props.variant.attributes[oldKey]

  props.variant.attributes[newKey] = value
}
</script>

<template>
  <div
    class="rounded-2xl border border-surface-200 dark:border-surface-700 p-6 bg-surface-50 dark:bg-surface-900"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">
        Variant {{ index + 1 }}
      </h3>

      <UiButton
        type="button"
        variant="danger"
        size="sm"
        @click="emit('remove')"
      >
        Remove
      </UiButton>
    </div>

    <!-- Basic -->

    <div class="grid lg:grid-cols-2 gap-5">

      <div>
        <label class="block text-sm font-medium mb-2">
          SKU
        </label>

        <input
          v-model="variant.sku"
          class="input"
          placeholder="SKU-001"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          Variant Name
        </label>

        <input
          v-model="variant.name"
          class="input"
          placeholder="Red / XL"
        />
      </div>

    </div>

    <!-- Price -->

    <div class="grid lg:grid-cols-2 gap-5 mt-6">

      <div>
        <label class="block text-sm font-medium mb-2">
          Price
        </label>

        <input
          v-model.number="variant.price"
          type="number"
          min="0"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          Compare Price
        </label>

        <input
          v-model.number="variant.compare_at_price"
          type="number"
          min="0"
          class="input"
        />
      </div>

    </div>

    <!-- Inventory -->

    <div class="grid lg:grid-cols-3 gap-5 mt-6">

      <div>
        <label class="block text-sm font-medium mb-2">
          Inventory
        </label>

        <input
          v-model.number="variant.inventory_quantity"
          type="number"
          min="0"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          Low Stock Threshold
        </label>

        <input
          v-model.number="variant.low_stock_threshold"
          type="number"
          min="0"
          class="input"
        />
      </div>

      <div class="flex items-end pb-2">

        <label class="flex items-center gap-3">

          <input
            v-model="variant.is_active"
            type="checkbox"
          />

          Active Variant

        </label>

      </div>

    </div>

    <!-- Attributes -->

    <div class="mt-8">

      <div class="flex justify-between items-center mb-4">

        <h4 class="font-medium">
          Attributes
        </h4>

        <UiButton
          type="button"
          variant="outline"
          size="sm"
          @click="addAttribute"
        >
          + Add Attribute
        </UiButton>

      </div>

      <div
        v-if="attributeEntries.length"
        class="space-y-4"
      >
        <div
          v-for="[key, value] in attributeEntries"
          :key="key"
          class="grid grid-cols-12 gap-3"
        >
          <input
            :value="key"
            class="input col-span-5"
            placeholder="Color"
            @change="
              renameAttribute(
                key,
                ($event.target as HTMLInputElement).value
              )
            "
          />

          <input
            v-model="variant.attributes[key]"
            class="input col-span-5"
            placeholder="Red"
          />

          <UiButton
            type="button"
            variant="danger"
            class="col-span-2"
            @click="removeAttribute(key)"
          >
            ✕
          </UiButton>

        </div>

      </div>

      <div
        v-else
        class="text-sm text-surface-500"
      >
        No attributes added.
      </div>

    </div>

  </div>
</template>

<style scoped>
.input{
    @apply w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none;
}
</style>