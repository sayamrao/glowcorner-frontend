<script setup lang="ts">
const trackingNumber = ref('')
const trackingResult = ref<null | { status: string; expectedDelivery: string }>(null)

const trackOrder = () => {
  if (trackingNumber.value.trim() === '') return
  // Mock tracking result
  trackingResult.value = {
    status: 'In Transit',
    expectedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString(),
  }
}

useHead({
  title: 'Track Order - FamilyCorner',
})
</script>

<template>
  <div class="container-app py-12 max-w-xl mx-auto text-center">
    <h1 class="text-3xl font-bold mb-4">Track Your Order</h1>
    <p class="text-surface-600 dark:text-surface-400 mb-8">Enter your tracking number below to get the latest status of your delivery.</p>
    
    <form @submit.prevent="trackOrder" class="flex gap-4 mb-8">
      <input 
        v-model="trackingNumber" 
        type="text" 
        placeholder="e.g. TRK-123456789" 
        class="flex-grow px-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
        required
      />
      <UiButton type="submit" variant="primary">Track</UiButton>
    </form>
    
    <div v-if="trackingResult" class="bg-surface-50 dark:bg-surface-800 p-6 rounded-2xl text-left border border-surface-200 dark:border-surface-700 animate-in fade-in slide-in-from-bottom-4">
      <h2 class="text-lg font-bold mb-4">Tracking Information</h2>
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 pb-4">
          <span class="text-surface-500">Status</span>
          <UiBadge variant="brand">{{ trackingResult.status }}</UiBadge>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-surface-500">Expected Delivery</span>
          <span class="font-medium">{{ trackingResult.expectedDelivery }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
