<script setup lang="ts">
import ProductForm from "~/components/product/ProductForm.vue";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

useHead({
  title: "Add Product",
});

const appStore = useAppStore();

const { categories, brands } = storeToRefs(appStore);

onMounted(() => {
  if (!categories.value.length) {
    appStore.fetchCategories();
  }

  // if (!brands.value.length) {
  //   appStore.fetchBrands();
  // }
});
</script>

<template>
  <div class="container-app">
    <ProductForm
      mode="create"
      :categories="categories"
      :brands="brands"
    />
  </div>
</template>