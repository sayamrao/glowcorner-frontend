<script setup lang="ts">
import type { Product } from '~/types'
import { formatPrice } from '~/utils'

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  'add-to-cart': [product: Product]
}>()
</script>

<template>
  <article
    class="group relative flex flex-col h-full bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-card-hover transition-all"
  >
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="flex flex-col h-full"
    >
      <div class="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-800">
        <img
          :src="product.images[0]?.url"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div
          v-if="product.compareAtPrice"
          class="absolute top-2 right-2 bg-danger-500 text-white text-xs font-bold px-2 py-1 rounded"
        >
          -{{ Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) }}%
        </div>
        <div
          v-if="product.stock === 0"
          class="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
        >
          <span class="bg-surface-900 text-white text-sm font-bold px-3 py-1 rounded">Out of Stock</span>
        </div>
      </div>

      <div class="p-4 flex flex-col flex-grow">
        <span class="text-xs text-surface-500 mb-1">{{ product.categoryName }}</span>
        <h3 class="font-medium text-surface-900 dark:text-white line-clamp-2 text-sm mb-2 group-hover:text-brand-600 transition-colors">
          {{ product.name }}
        </h3>

        <div class="flex items-center gap-1 text-xs text-amber-500 mb-3">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span>{{ product.rating }}</span>
          <span class="text-surface-400">({{ product.reviewCount }})</span>
        </div>

        <div class="mt-auto pt-2 flex items-end justify-between border-t border-surface-100 dark:border-surface-800 pr-10">
          <div class="flex flex-col">
            <span class="text-lg font-bold text-brand-600 dark:text-brand-400 leading-none">{{ formatPrice(product.price) }}</span>
            <span
              v-if="product.compareAtPrice"
              class="text-xs text-surface-400 line-through mt-1"
            >
              {{ formatPrice(product.compareAtPrice) }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <button
      type="button"
      class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"
      title="Add to cart"
      @click="emit('add-to-cart', product)"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
    </button>
  </article>
</template>
