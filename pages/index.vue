<script setup lang="ts">
import { mockBanners, mockProducts } from '~/services/mockData'
import { listCategories } from '~/services/commerce'
import type { Category, Product } from '~/types'
import { listProducts } from '~/services/commerce'
import { formatPrice } from '~/utils'

const banners = ref(mockBanners)
const categories = ref<Category[]>([])
const trendingProducts = ref<Product[]>([])
const flashSaleProducts = ref<Product[]>([])

const categoryIcons: Record<string, string> = {
  'remote-controlled': '🏎️',
  'water-toys': '🔫',
  'educational-toys': '🧩',
  'musical-toys': '🎹',
  'bubble-guns': '🫧',
  'die-cast-model-cars': '🚗',
  'makeup': '💅',
  'money-box': '🏦',
}

const { data: categoriesData } = await useAsyncData('homeCategories', async () => {
  try {
    return await listCategories()
  } catch {
    return []
  }
})

categories.value = (categoriesData.value || []).slice(0, 8)

const { data: homeProductsData } = await useAsyncData('homeProducts', async () => {
  try {
    const homeProducts = await listProducts({ limit: 8, sortBy: 'newest' })
    console.log("home prodycts: ", homeProducts)
    return homeProducts
  } catch {
    return {
      data: mockProducts.slice(0, 8),
      total: mockProducts.length,
      page: 1,
      limit: 8,
      totalPages: 1,
    }
  }
})

const homeProducts = homeProductsData.value?.data || []
trendingProducts.value = homeProducts.slice(0, 4)
flashSaleProducts.value = homeProducts.filter(product => product.compareAtPrice && product.compareAtPrice > product.price).slice(0, 4)

// Computed for flash sale countdown mock
const timeLeft = ref({ hours: 12, minutes: 45, seconds: 30 })

onMounted(() => {
  const timer = setInterval(() => {
    if (timeLeft.value.seconds > 0) {
      timeLeft.value.seconds--
    } else if (timeLeft.value.minutes > 0) {
      timeLeft.value.minutes--
      timeLeft.value.seconds = 59
    } else if (timeLeft.value.hours > 0) {
      timeLeft.value.hours--
      timeLeft.value.minutes = 59
      timeLeft.value.seconds = 59
    } else {
      clearInterval(timer)
    }
  }, 1000)

  onUnmounted(() => clearInterval(timer))
})
</script>

<template>
  <div class="flex flex-col gap-12 pb-16">
    <!-- Hero Banner Carousel -->
    <section class="relative w-full overflow-hidden bg-surface-100 dark:bg-surface-900">
      <div class="w-full">
        <div 
          v-for="banner in banners" 
          :key="banner.id"
          class="w-full flex-shrink-0 relative group"
        >
          <img :src="banner.image" :alt="banner.title" class="w-full h-full object-cover" loading="lazy" />
          <!-- Dark Overlay for Text Readability -->
          <div class="absolute inset-0 bg-gradient-to-r to-transparent flex items-center">
            <!-- <div class="container-app text-white space-y-4 px-6 md:px-12">
              <h2 class="text-3xl md:text-5xl lg:text-6xl font-display font-bold max-w-2xl leading-tight">
                {{ banner.title }}
              </h2>
              <p class="text-lg md:text-xl text-surface-200 max-w-xl">
                {{ banner.subtitle }}
              </p>
              <NuxtLink :to="banner.link">
                <UiButton variant="primary" size="lg" class="mt-4">
                  Shop Now
                </UiButton>
              </NuxtLink>
            </div> -->
          </div>
        </div>
      </div>
      <!-- Mock Carousel Controls -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button v-for="(_, index) in banners" :key="index" class="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-colors" :class="{'bg-white w-8': index === 0}"></button>
      </div>
    </section>

    <!-- Categories -->
    <section class="container-app">
      <h2 class="text-2xl font-bold mb-6">Shop by Category</h2>
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
        <NuxtLink 
          v-for="category in categories" 
          :key="category.id"
          :to="`/products?category=${category.slug}`"
          class="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors group"
        >
          <div class="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-all">
            {{ categoryIcons[category.slug] || '🛍️' }}
          </div>
          <span class="text-sm font-medium text-center text-surface-700 dark:text-surface-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {{ category.name }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Flash Sale -->
    <section v-if="flashSaleProducts.length" class="container-app">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <span class="text-danger-500">⚡</span> Flash Sale
          </h2>
          <div class="flex gap-2 text-white font-mono text-sm">
            <span class="bg-danger-500 px-2 py-1 rounded">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
            <span class="text-danger-500 font-bold">:</span>
            <span class="bg-danger-500 px-2 py-1 rounded">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
            <span class="text-danger-500 font-bold">:</span>
            <span class="bg-danger-500 px-2 py-1 rounded">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
          </div>
        </div>
        <NuxtLink to="/products?sale=true" class="text-brand-600 hover:text-brand-700 font-medium text-sm">View All</NuxtLink>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <NuxtLink 
          v-for="product in flashSaleProducts" 
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group block bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-card-hover transition-all"
        >
          <div class="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-800">
             <img v-if="product.images.length > 0" :src="product.images[0].url" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
             <div v-if="product.compareAtPrice" class="absolute top-2 right-2 bg-danger-500 text-white text-xs font-bold px-2 py-1 rounded">
               -{{ Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) }}%
             </div>
          </div>
          <div class="p-4 space-y-2">
            <h3 class="font-medium text-surface-900 dark:text-white line-clamp-2 text-sm">{{ product.name }}</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-lg font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(product.price) }}</span>
              <span v-if="product.compareAtPrice" class="text-xs text-surface-400 line-through">{{ formatPrice(product.compareAtPrice) }}</span>
            </div>
            <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 mt-2">
              <div class="bg-danger-500 h-1.5 rounded-full" :style="{ width: `${(product.stock / 100) * 100}%` }"></div>
            </div>
            <p class="text-xs text-surface-500 mt-1">{{ product.stock }} left in stock</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="container-app">
      <div class="flex items-end justify-between mb-6">
        <h2 class="text-2xl font-bold">Trending Now</h2>
        <NuxtLink to="/products?sort=trending" class="text-brand-600 hover:text-brand-700 font-medium text-sm">View All</NuxtLink>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <NuxtLink 
          v-for="product in trendingProducts" 
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group block bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-card-hover transition-all"
        >
          <div class="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-800">
             <img v-if="product.images.length > 0" :src="product.images[0].url" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
          <div class="p-4 space-y-1">
            <span class="text-xs text-surface-500">{{ product.categoryName }}</span>
            <h3 class="font-medium text-surface-900 dark:text-white line-clamp-2 text-sm">{{ product.name }}</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 mb-2">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span>{{ product.rating }}</span>
              <span class="text-surface-400">({{ product.reviewCount }})</span>
            </div>
            <div class="text-lg font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(product.price) }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Features Banner -->
    <section class="container-app">
      <div class="bg-surface-50 dark:bg-surface-900 rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="flex flex-col items-center text-center gap-3">
          <div class="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl">🚚</div>
          <h4 class="font-bold text-surface-900 dark:text-white">Nationwide Delivery</h4>
          <p class="text-sm text-surface-600 dark:text-surface-400">Fast delivery across Pakistan</p>
        </div>
        <div class="flex flex-col items-center text-center gap-3">
          <div class="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl">💵</div>
          <h4 class="font-bold text-surface-900 dark:text-white">Cash on Delivery</h4>
          <p class="text-sm text-surface-600 dark:text-surface-400">Pay when you receive</p>
        </div>
        <div class="flex flex-col items-center text-center gap-3">
          <div class="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl">🛡️</div>
          <h4 class="font-bold text-surface-900 dark:text-white">Safe & Non-Toxic</h4>
          <p class="text-sm text-surface-600 dark:text-surface-400">100% child-safe materials</p>
        </div>
        <div class="flex flex-col items-center text-center gap-3">
          <div class="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl">📞</div>
          <h4 class="font-bold text-surface-900 dark:text-white">24/7 Support</h4>
          <p class="text-sm text-surface-600 dark:text-surface-400">Dedicated help center</p>
        </div>
      </div>
    </section>
  </div>
</template>
