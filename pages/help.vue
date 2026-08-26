<script setup lang="ts">
useHead({
  title: 'Help Center - FamilyCorner',
})
</script>

<template>
  <div class="container-app py-12 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Help Center</h1>
    
    <div class="space-y-6">
      <div class="bg-surface-50 dark:bg-surface-800 p-6 rounded-2xl">
        <h2 class="text-xl font-bold mb-2">Frequently Asked Questions</h2>
        <div class="space-y-4 mt-4">
          <div>
            <h3 class="font-medium">How do I reset my password?</h3>
            <p class="text-surface-600 dark:text-surface-400 mt-1">You can reset your password by clicking on the "Forgot Password" link on the login page.</p>
          </div>
          <div>
            <h3 class="font-medium">How can I contact customer support?</h3>
            <p class="text-surface-600 dark:text-surface-400 mt-1">You can reach out to our customer support via email at support@familycorner.com or call us directly.</p>
          </div>
        </div>
      </div>
      
      <div class="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-2xl">
        <h2 class="text-xl font-bold text-brand-700 dark:text-brand-400 mb-2">Still need help?</h2>
        <p class="text-surface-600 dark:text-surface-400 mb-4">Our support team is available 24/7 to assist you.</p>
        <UiButton variant="primary">Contact Us</UiButton>
      </div>
    </div>
  </div>
</template>
