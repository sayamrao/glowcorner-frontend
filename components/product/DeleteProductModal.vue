<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  delete: [Product]
}>()
</script>

<template>
  <div class="flex gap-2">
    <NuxtLink :to="`/seller/products/${props.product.id}/edit`">
      <UiButton size="sm" variant="outline">
        Edit
      </UiButton>
    </NuxtLink>

    <UiButton
      size="sm"
      variant="danger"
      @click="emit('delete', props.product)"
    >
      Delete
    </UiButton>
  </div>
</template>