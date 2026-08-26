<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

// Initialize stores on app mount
onMounted(() => {
  authStore.initialize()
  cartStore.loadFromStorage()
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FamilyCorner` : 'FamilyCorner — Baby Toys & Fun Learning'
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
