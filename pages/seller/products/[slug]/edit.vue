<script setup lang="ts">
import { getProductRaw } from '~/services/commerce'
import ProductForm from '~/components/product/ProductForm.vue'

const appStore = useAppStore()
const { categories, brands } = storeToRefs(appStore)
const route = useRoute()

const product = ref()

onMounted(async () => {
  if (!categories.value.length) {
    appStore.fetchCategories()
  }

  product.value = await getProductRaw(route.params.slug as string)
})
</script>

<template>
  <ProductForm
    v-if="product"
    mode="edit"
    :product="product"
    :categories="categories"
    :brands="brands"
  />
</template>