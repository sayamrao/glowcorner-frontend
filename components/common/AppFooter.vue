<template>
  <footer class="bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 pt-16 pb-8">
    <div class="container-app">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 mb-12">
        <!-- Brand -->
        <div class="space-y-4">
          <NuxtLink to="/" class="inline-block">
            <span class="text-2xl font-display font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              FamilyCorner
            </span>
          </NuxtLink>
          <p class="text-surface-600 dark:text-surface-400 text-sm">
            Pakistan's premium marketplace for authentic baby toys, educational games, and fun learning activities. We deliver original brands with Cash on Delivery nationwide.
          </p>
          <div class="flex gap-4">
            <!-- Social Icons (Mock) -->
            <a href="#" class="text-surface-400 hover:text-brand-600 transition-colors"><span class="sr-only">Facebook</span>FB</a>
            <a href="#" class="text-surface-400 hover:text-accent-500 transition-colors"><span class="sr-only">Instagram</span>IG</a>
            <a href="#" class="text-surface-400 hover:text-brand-600 transition-colors"><span class="sr-only">Twitter</span>TW</a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h3 class="font-semibold text-surface-900 dark:text-white mb-4">Shop Categories</h3>
          <ul class="space-y-3 text-sm text-surface-600 dark:text-surface-400">
            <li><NuxtLink to="/products?category=remote-controlled" class="hover:text-brand-600 transition-colors">Remote Controlled</NuxtLink></li>
            <li><NuxtLink to="/products?category=educational-toys" class="hover:text-brand-600 transition-colors">Educational Toys</NuxtLink></li>
            <li><NuxtLink to="/products?category=water-toys" class="hover:text-brand-600 transition-colors">Water Toys</NuxtLink></li>
            <li><NuxtLink to="/products?category=die-cast-model-cars" class="hover:text-brand-600 transition-colors">Die Cast Cars</NuxtLink></li>
          </ul>
        </div>

        <!-- Links -->
        <div>
          <h3 class="font-semibold text-surface-900 dark:text-white mb-4">Customer Care</h3>
          <ul class="space-y-3 text-sm text-surface-600 dark:text-surface-400">
            <li><NuxtLink to="/help" class="hover:text-brand-600 transition-colors">Help Center</NuxtLink></li>
            <li><NuxtLink to="/shipping" class="hover:text-brand-600 transition-colors">Shipping & Delivery</NuxtLink></li>
            <li><NuxtLink to="/returns" class="hover:text-brand-600 transition-colors">Returns & Refunds</NuxtLink></li>
            <li><NuxtLink to="/track" class="hover:text-brand-600 transition-colors">Track Order</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-semibold text-surface-900 dark:text-white mb-4">Contact Us</h3>
          <ul class="space-y-3 text-sm text-surface-600 dark:text-surface-400">
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              support@familycorner.pk
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +92 315 1992520
            </li>
          </ul>
          <div class="mt-6 flex gap-2">
            <!-- Payment Icons Mock -->
            <div class="px-2 py-1 bg-white border border-surface-200 rounded text-xs font-bold text-surface-800">COD</div>
            <div class="px-2 py-1 bg-white border border-surface-200 rounded text-xs font-bold text-red-600">JazzCash</div>
            <div class="px-2 py-1 bg-white border border-surface-200 rounded text-xs font-bold text-green-600">EasyPaisa</div>
            <div class="px-2 py-1 bg-white border border-surface-200 rounded text-xs font-bold text-blue-800">VISA</div>
          </div>
        </div>
      </div>

      <div class="border-t border-surface-200 dark:border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-surface-500">© {{ new Date().getFullYear() }} FamilyCorner. All rights reserved.</p>
        <div class="flex gap-4 text-sm text-surface-500">
          <NuxtLink to="/privacy" class="hover:text-brand-600">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-brand-600">Terms of Service</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
