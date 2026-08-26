<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-100 selection:bg-brand-200 selection:text-brand-900">
    <CommonAppHeader />
    
    <main class="flex-grow flex flex-col">
      <slot />
    </main>

    <CommonAppFooter />
  </div>
</template>
