<script setup lang="ts">
import { mockProducts, mockCategories } from '~/services/mockData'
import { SORT_OPTIONS } from '~/constants'
import { listProducts } from '~/services/commerce'
import type { Product } from '~/types'

const route = useRoute()
const router = useRouter()

const viewMode = ref<'grid' | 'list'>('grid')
const showMobileFilters = ref(false)
const isLoading = ref(false)
const apiError = ref('')

// Filters State
const selectedCategory = ref(route.query.category as string || '')
const searchQuery = ref(route.query.q as string || '')
const sortBy = ref(route.query.sort as string || 'popular')
const minPrice = ref(route.query.minPrice as string || '')
const maxPrice = ref(route.query.maxPrice as string || '')
const products = ref<Product[]>([])
const totalProducts = ref(0)

async function fetchProducts() {
  isLoading.value = true
  apiError.value = ''

  try {
    const category = mockCategories.find(cat => cat.slug === selectedCategory.value || cat.id === selectedCategory.value)
    const response = await listProducts({
      page: 1,
      limit: 48,
      search: searchQuery.value || undefined,
      category: category?.id && category.id.includes('-') ? undefined : category?.id,
      sortBy: sortBy.value as any,
    })
    products.value = response.data
    totalProducts.value = response.total
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load products from API'
    products.value = [...mockProducts]
    totalProducts.value = products.value.length
  } finally {
    isLoading.value = false
  }
}

// Computed Filtered Products
const filteredProducts = computed(() => {
  let result = [...products.value]

  if (selectedCategory.value) {
    const category = mockCategories.find(cat => cat.slug === selectedCategory.value || cat.id === selectedCategory.value)
    const hasCategoryMatches = result.some(p => (
      p.categoryId === selectedCategory.value ||
      p.categoryId === category?.id ||
      p.categoryName.toLowerCase() === selectedCategory.value.toLowerCase() ||
      p.categoryName.toLowerCase() === category?.name.toLowerCase()
    ))
    if (hasCategoryMatches) {
      result = result.filter(p => (
        p.categoryId === selectedCategory.value ||
        p.categoryId === category?.id ||
        p.categoryName.toLowerCase() === selectedCategory.value.toLowerCase() ||
        p.categoryName.toLowerCase() === category?.name.toLowerCase()
      ))
    }
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q))
  }

  if (minPrice.value) {
    result = result.filter(p => p.price >= Number(minPrice.value))
  }

  if (maxPrice.value) {
    result = result.filter(p => p.price <= Number(maxPrice.value))
  }

  // Sort
  switch (sortBy.value) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'popular':
    default:
      result.sort((a, b) => b.reviewCount - a.reviewCount)
  }

  return result
})

// Watchers to update URL
watch([selectedCategory, searchQuery, sortBy], () => {
  router.push({
    query: {
      ...route.query,
      category: selectedCategory.value || undefined,
      q: searchQuery.value || undefined,
      sort: sortBy.value !== 'popular' ? sortBy.value : undefined,
    }
  })
  fetchProducts()
})

watch([minPrice, maxPrice], () => {
  router.push({
    query: {
      ...route.query,
      minPrice: minPrice.value || undefined,
      maxPrice: maxPrice.value || undefined,
    },
  })
})

await fetchProducts()

useHead({
  title: 'Shop Products',
})
</script>

<template>
  <div class="container-app py-8">
    
    <!-- Mobile Filter Toggle -->
    <div class="lg:hidden flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Products</h1>
      <UiButton variant="outline" size="sm" @click="showMobileFilters = true" icon>
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
      </UiButton>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 items-start">
      
      <!-- Desktop Sidebar Filters -->
      <aside class="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24">
        <div>
          <h3 class="font-bold mb-4">Categories</h3>
          <ul class="space-y-2">
            <li>
              <button 
                class="text-sm transition-colors hover:text-brand-600 w-full text-left" 
                :class="!selectedCategory ? 'text-brand-600 font-bold' : 'text-surface-600 dark:text-surface-400'"
                @click="selectedCategory = ''"
              >
                All Categories
              </button>
            </li>
            <li v-for="cat in mockCategories" :key="cat.id">
              <button 
                class="text-sm transition-colors hover:text-brand-600 w-full text-left flex justify-between items-center" 
                :class="selectedCategory === cat.slug || selectedCategory === cat.id ? 'text-brand-600 font-bold' : 'text-surface-600 dark:text-surface-400'"
                @click="selectedCategory = cat.slug"
              >
                <span>{{ cat.name }}</span>
                <span class="text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">{{ cat.productCount }}</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-bold mb-4">Price Range</h3>
          <div class="flex items-center gap-2">
            <UiInput v-model="minPrice" placeholder="Min" type="number" class="w-full" />
            <span class="text-surface-400">-</span>
            <UiInput v-model="maxPrice" placeholder="Max" type="number" class="w-full" />
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow w-full">
        <!-- Topbar -->
        <div class="hidden lg:flex items-center justify-between mb-6 bg-surface-50 dark:bg-surface-900/50 p-4 rounded-2xl">
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Showing <strong>{{ filteredProducts.length }}</strong><span v-if="totalProducts"> of {{ totalProducts }}</span> products
          </p>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-surface-600">Sort by:</label>
              <select v-model="sortBy" class="text-sm border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 py-1.5 pl-3 pr-8 focus:ring-brand-500">
                <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div v-if="apiError" class="mb-4 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local catalog fallback.
        </div>

        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <UiSkeleton v-for="item in 8" :key="item" class="aspect-[3/4] rounded-2xl" />
        </div>

        <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-24 bg-surface-50 dark:bg-surface-900 rounded-3xl">
          <div class="text-4xl mb-4">🔍</div>
          <h2 class="text-xl font-bold mb-2">No products found</h2>
          <p class="text-surface-500 mb-6">Try adjusting your filters or search term.</p>
          <UiButton @click="selectedCategory = ''; searchQuery = ''">Clear Filters</UiButton>
        </div>
      </div>
    </div>
    
    <!-- Mobile Filters Modal -->
    <UiModal v-model="showMobileFilters" title="Filters" size="sm">
       <div class="space-y-6">
        <div>
          <label class="font-bold text-sm block mb-2">Sort By</label>
          <select v-model="sortBy" class="w-full text-sm border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 py-2.5 px-3">
            <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div>
          <label class="font-bold text-sm block mb-3">Categories</label>
          <div class="space-y-2 max-h-[40vh] overflow-y-auto">
            <label class="flex items-center gap-3">
              <input type="radio" v-model="selectedCategory" value="" class="text-brand-600 focus:ring-brand-500" />
              <span>All Categories</span>
            </label>
            <label v-for="cat in mockCategories" :key="cat.id" class="flex items-center gap-3">
              <input type="radio" v-model="selectedCategory" :value="cat.slug" class="text-brand-600 focus:ring-brand-500" />
              <span>{{ cat.name }}</span>
            </label>
          </div>
        </div>
        <UiButton fullWidth @click="showMobileFilters = false">Apply Filters</UiButton>
      </div>
    </UiModal>
  </div>
</template>
