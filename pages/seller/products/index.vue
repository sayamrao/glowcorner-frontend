<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { formatPrice } from '~/utils'
import { listSellerProducts, deleteProduct } from '~/services/commerce'
import type { Product } from '~/types'
import ProductActions from '~/components/product/ProductActions.vue'
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const authStore = useAuthStore()
const products = ref<Product[]>([])
const apiError = ref('')
const isLoading = ref(true)
const appStore = useAppStore(); 

const { categories, brands } = storeToRefs(appStore);

onMounted(async () => {
  console.log("mounted")
  try {
    products.value = await listSellerProducts()
    console.log(products.value)
  } catch (error: any) {
    apiError.value = error?.message || 'Could not load products from API'
    // Fallback to mock data structure for visual testing
    products.value = [
      { id: '1', name: '360° Remote Control Stunt Car', price: 3490, stock: 12, isActive: true, sales: 45 } as unknown as Product,
      { id: '2', name: 'Splash & Learn Water Play Table', price: 5890, stock: 50, isActive: true, sales: 120 } as unknown as Product,
      { id: '3', name: 'Interactive Baby Piano Keyboard', price: 2290, stock: 0, isActive: false, sales: 300 } as unknown as Product,
    ]
    if (!categories.value.length) {
        appStore.fetchCategories();
    }
  } finally {
    isLoading.value = false
  }
})

useHead({
  title: 'My Products - Seller Dashboard',
})


const confirmDelete = async (product: Product) => {
    if (!confirm('Delete this product?')) return

    await deleteProduct(product.id)

    products.value = products.value.filter(p => p.id !== product.id)

    toast.success(
        'Deleted',
        'Product removed successfully.'
    )
}

</script>

<template>
  <div class="container-app py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 shrink-0">
        <div class="bg-brand-600 text-white rounded-2xl p-6 mb-6">
          <p class="text-brand-100 text-sm mb-1">Store Profile</p>
          <h2 class="font-bold text-xl mb-4">{{ authStore.userName }}</h2>
          <div class="flex gap-2">
            <UiBadge variant="neutral" class="!bg-white/20 !text-white border-none">Verified Seller</UiBadge>
          </div>
        </div>

        <nav class="space-y-1">
          <NuxtLink to="/seller" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <span class="text-lg">📈</span> Dashboard
          </NuxtLink>
          <NuxtLink to="/seller/products" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium transition-colors">
            <span class="text-lg">🛍️</span> Products
          </NuxtLink>
          <NuxtLink to="/seller/orders" class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-700 dark:text-surface-300 transition-colors">
            <div class="flex items-center gap-3">
               <span class="text-lg">📦</span> Orders
            </div>
          </NuxtLink>
          <button @click="authStore.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-50 text-danger-600 dark:hover:bg-danger-900/20 dark:text-danger-400 transition-colors text-left mt-4 border-t border-surface-200 dark:border-surface-800 rounded-t-none">
            <span class="text-lg">🚪</span> Log Out
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">My Products</h1>
            <p class="text-surface-500">Manage your store catalog and inventory</p>
          </div>
          <NuxtLink to="/seller/products/new">
            <UiButton variant="primary">Add New Product</UiButton>
          </NuxtLink>
        </div>

        <div v-if="apiError" class="mb-4 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-300">
          {{ apiError }}. Showing local fallback.
        </div>

        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 text-sm font-medium text-surface-500">
                  <th class="py-4 px-6">Product</th>
                  <th class="py-4 px-6">Price</th>
                  <th class="py-4 px-6">Category</th>
                  <th class="py-4 px-6">Stock</th>
                  <th class="py-4 px-6">Sales</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-800">
                <tr v-for="product in products" :key="product.id" class="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                  <td class="py-4 px-6 font-medium">{{ product.name }}</td>
                  <td class="py-4 px-6">{{ formatPrice(product.price) }}</td>
                  <td class="py-4 px-6">{{ product.categoryName }}</td>
                  <td class="py-4 px-6">{{ product.stock }}</td>
                  <td class="py-4 px-6">{{ (product as any).sales || 0 }}</td>
                  <td class="py-4 px-6">
                    <UiBadge :variant="product.stock > 0 && product.isActive ? 'success' : 'danger'" size="sm">
                      {{ product.stock > 0 && product.isActive ? 'Active' : 'Out of Stock' }}
                    </UiBadge>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <ProductActions
                        :product="product"
                        @delete="confirmDelete"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between text-sm text-surface-500">
            <span>Showing 1 to {{ products.length }} of {{ products.length }} entries</span>
            <div class="flex gap-2">
              <UiButton variant="outline" size="sm" disabled>Previous</UiButton>
              <UiButton variant="outline" size="sm" disabled>Next</UiButton>
            </div>
          </div>
        </div>
        <!-- <DeleteProductModal
            :open="deleteModalOpen"
            :product="product"
            @confirm="confirmDelete"
            @close="closeDeleteModal"
        /> -->
      </div>

    </div>
  </div>
</template>
