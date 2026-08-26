<script setup lang="ts">
import { mockProducts } from '~/services/mockData'
import { useCartStore } from '~/stores/cart'
import { formatPrice, generateWhatsAppOrderUrl } from '~/utils'
import { useToast } from '~/composables/useToast'
import { getProduct } from '~/services/commerce'

const route = useRoute()
const cartStore = useCartStore()
const toast = useToast()
const config = useRuntimeConfig()
const apiError = ref('')

const slug = computed(() => String(route.params.slug ?? ''))

const { data: productData } = await useAsyncData(
  () => `product:${slug.value}`,
  async () => {
    if (!slug.value) return null

    try {
      return await getProduct(slug.value)
    } catch (error: any) {
      apiError.value = error?.message || 'Could not load product from API'
      return mockProducts.find(p => p.slug === slug.value || p.id === slug.value) || null
    }
  },
  { watch: [slug] }
)
const product = computed(() => productData.value)

// State
const selectedVariant = ref(product.value?.variants[0] || null)
const quantity = ref(1)
const mainImage = ref(product.value?.images.find(img => img.isMain)?.url || product.value?.images[0]?.url)

watch(product, (nextProduct) => {
  selectedVariant.value = nextProduct?.variants[0] || null
  mainImage.value = nextProduct?.images.find(img => img.isMain)?.url || nextProduct?.images[0]?.url
})

// Computed
const currentPrice = computed(() => selectedVariant.value?.price || product.value?.price || 0)
const currentComparePrice = computed(() => selectedVariant.value?.compareAtPrice || product.value?.compareAtPrice)
const isOutOfStock = computed(() => (selectedVariant.value?.stock ?? product.value?.stock ?? 0) === 0)
const maxQuantity = computed(() => selectedVariant.value?.stock ?? product.value?.stock ?? 1)

// Actions
function handleAddToCart() {
  if (!product.value) return
  
  cartStore.addItem({
    productId: product.value.id,
    productName: product.value.name,
    productImage: mainImage.value || '',
    productSlug: product.value.slug,
    variantId: selectedVariant.value?.id,
    variantName: selectedVariant.value?.name,
    price: currentPrice.value,
    compareAtPrice: currentComparePrice.value,
    quantity: quantity.value,
    maxQuantity: maxQuantity.value,
    sellerName: product.value.sellerName,
  })
  
  toast.success('Added to Cart', `${product.value.name} has been added to your cart.`)
}

function handleBuyNow() {
  handleAddToCart()
  navigateTo('/checkout')
}

function handleWhatsAppOrder() {
  if (!product.value) return
  const url = generateWhatsAppOrderUrl(
    config.public.whatsappNumber as string,
    [{
      name: `${product.value.name}${selectedVariant.value ? ` (${selectedVariant.value.name})` : ''}`,
      quantity: quantity.value,
      price: currentPrice.value,
    }],
    currentPrice.value * quantity.value
  )
  window.open(url, '_blank')
}

useHead({
  title: product.value?.name || 'Product Not Found',
  meta: [
    { name: 'description', content: product.value?.description || '' }
  ]
})
</script>

<template>
  <div v-if="product" class="container-app py-8 md:py-12">
    <!-- Breadcrumbs (Mock) -->
    <nav class="flex text-sm text-surface-500 mb-8" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <NuxtLink to="/" class="hover:text-brand-600">Home</NuxtLink>
        </li>
        <li>
          <div class="flex items-center">
            <span class="mx-2">/</span>
            <NuxtLink :to="`/products?category=${product.categoryId}`" class="hover:text-brand-600">{{ product.categoryName }}</NuxtLink>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <span class="mx-2">/</span>
            <span class="text-surface-900 dark:text-surface-100 font-medium line-clamp-1">{{ product.name }}</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <div class="aspect-square bg-surface-100 dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700">
          <img :src="mainImage" :alt="product.name" class="w-full h-full object-cover" />
        </div>
        <div v-if="product.images.length > 1" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            v-for="image in product.images" 
            :key="image.id"
            class="relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0"
            :class="mainImage === image.url ? 'border-brand-500' : 'border-transparent hover:border-surface-300'"
            @click="mainImage = image.url"
          >
            <img :src="image.url" :alt="image.alt" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <!-- Badge & Title -->
        <div class="mb-4 space-y-2">
          <UiBadge v-if="product.isFeatured" variant="brand">Featured</UiBadge>
          <h1 class="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-white">
            {{ product.name }}
          </h1>
          <div class="flex items-center gap-4 text-sm text-surface-600 dark:text-surface-400">
            <span class="flex items-center gap-1">
              <span class="text-amber-500">★</span> {{ product.rating }} ({{ product.reviewCount }} reviews)
            </span>
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-end gap-3 mb-6 pb-6 border-b border-surface-200 dark:border-surface-800">
          <span class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(currentPrice) }}</span>
          <span v-if="currentComparePrice" class="text-lg text-surface-400 line-through mb-1">{{ formatPrice(currentComparePrice) }}</span>
          <UiBadge v-if="currentComparePrice" variant="danger" class="mb-1.5 ml-2">
            -{{ Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100) }}%
          </UiBadge>
        </div>

        <!-- Description Snippet -->
        <p class="text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
          {{ product.description }}
        </p>

        <!-- Variants -->
        <div v-if="product.variants.length > 0" class="mb-8 space-y-3">
          <h3 class="font-medium text-surface-900 dark:text-white">Select Option</h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              class="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
              :class="selectedVariant?.id === variant.id 
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' 
                : 'border-surface-200 text-surface-700 hover:border-surface-300 dark:border-surface-700 dark:text-surface-300 dark:hover:border-surface-600'"
              @click="selectedVariant = variant"
            >
              {{ variant.name }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-auto space-y-4">
          <!-- Quantity -->
          <div class="flex items-center gap-4">
            <span class="font-medium text-surface-900 dark:text-white">Quantity</span>
            <div class="flex items-center border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
              <button 
                class="w-10 h-10 flex items-center justify-center hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-50"
                :disabled="quantity <= 1"
                @click="quantity--"
              >-</button>
              <span class="w-12 text-center font-medium">{{ quantity }}</span>
              <button 
                class="w-10 h-10 flex items-center justify-center hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-50"
                :disabled="quantity >= maxQuantity"
                @click="quantity++"
              >+</button>
            </div>
            <span class="text-sm text-surface-500">{{ maxQuantity }} available</span>
          </div>

          <!-- Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <UiButton 
              variant="outline" 
              size="lg" 
              fullWidth 
              :disabled="isOutOfStock"
              @click="handleAddToCart"
            >
              Add to Cart
            </UiButton>
            <UiButton 
              variant="primary" 
              size="lg" 
              fullWidth 
              :disabled="isOutOfStock"
              @click="handleBuyNow"
            >
              Buy Now
            </UiButton>
          </div>
          
          <!-- WhatsApp Quick Order -->
          <UiButton 
            variant="success" 
            size="lg" 
            fullWidth 
            class="!bg-[#25D366] hover:!bg-[#128C7E] text-white"
            @click="handleWhatsAppOrder"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Order via WhatsApp
          </UiButton>
        </div>

        <div class="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 grid grid-cols-2 gap-4 text-sm text-surface-600 dark:text-surface-400">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            100% Authentic
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Return within 7 days
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container-app py-24 text-center">
    <h1 class="text-2xl font-bold mb-4">Product Not Found</h1>
    <NuxtLink to="/">
      <UiButton>Back to Home</UiButton>
    </NuxtLink>
  </div>
</template>
