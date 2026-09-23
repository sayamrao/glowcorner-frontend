<script setup lang="ts">
import { mockProducts } from '~/services/mockData'
import { SORT_OPTIONS } from '~/constants'
import { listCategories, listProducts } from '~/services/commerce'
import type { Category, Product, ProductListParams } from '~/types'

const route = useRoute()
const router = useRouter()

const viewMode = ref<'grid' | 'list'>('grid')
const showMobileFilters = ref(false)
const isLoading = ref(false)
const apiError = ref('')

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const totalProducts = ref(0)

const selectedCategory = computed({
  get: () => String(route.query.category || ''),
  set: (value: string) => {
    updateRouteQuery({ category: value || undefined })
  },
})

const searchQuery = computed({
  get: () => String(route.query.q || ''),
  set: (value: string) => {
    updateRouteQuery({ q: value || undefined })
  },
})

const sortBy = computed({
  get: () => String(route.query.sort || 'popular'),
  set: (value: string) => {
    updateRouteQuery({ sort: value !== 'popular' ? value : undefined })
  },
})

const minPrice = computed({
  get: () => String(route.query.minPrice || ''),
  set: (value: string) => {
    updateRouteQuery({ minPrice: value || undefined })
  },
})

const maxPrice = computed({
  get: () => String(route.query.maxPrice || ''),
  set: (value: string) => {
    updateRouteQuery({ maxPrice: value || undefined })
  },
})

async function updateRouteQuery(changes: Record<string, string | undefined>) {
  await router.push({
    query: {
      ...route.query,
      ...changes,
    },
  })
}

function findCategoryBySlugOrId(
  items: Category[],
  value: string
): Category | undefined {
  for (const category of items) {
    if (category.slug === value || category.id === value) {
      return category
    }

    const child = findCategoryBySlugOrId(category.children || [], value)
    if (child) {
      return child
    }
  }

  return undefined
}

function getSelectedCategoryId(): string | undefined {
  if (!selectedCategory.value) {
    return undefined
  }

  return findCategoryBySlugOrId(categories.value, selectedCategory.value)?.id
}

async function fetchProducts() {
  isLoading.value = true
  apiError.value = ''

  try {
    const response = await listProducts({
      page: 1,
      limit: 48,
      search: searchQuery.value || undefined,
      category: getSelectedCategoryId(),
      minPrice: minPrice.value ? Number(minPrice.value) : undefined,
      maxPrice: maxPrice.value ? Number(maxPrice.value) : undefined,
      sortBy: sortBy.value as ProductListParams['sortBy'],
    })

    products.value = response.data
    totalProducts.value = response.total
  } catch (error: any) {
    console.error('Failed to load products:', error)
    apiError.value = error?.message || 'Could not load products from API'
    products.value = [...mockProducts]
    totalProducts.value = products.value.length
  } finally {
    isLoading.value = false
  }
}

const filteredProducts = computed(() => products.value)

watch(
  () => [
    route.query.category,
    route.query.q,
    route.query.sort,
    route.query.minPrice,
    route.query.maxPrice,
  ],
  () => {
    fetchProducts()
  }
)

categories.value = await listCategories()
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
            <li v-for="cat in categories" :key="cat.id">
              <button 
                class="text-sm transition-colors hover:text-brand-600 w-full text-left flex justify-between items-center" 
                :class="selectedCategory === cat.slug || selectedCategory === cat.id ? 'text-brand-600 font-bold' : 'text-surface-600 dark:text-surface-400'"
                @click="selectedCategory = cat.slug"
              >
                <span>{{ cat.name }}</span>
                
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
            <label v-for="cat in categories" :key="cat.id" class="flex items-center gap-3">
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
