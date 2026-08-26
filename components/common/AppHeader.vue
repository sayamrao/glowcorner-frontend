<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()

const isMenuOpen = ref(false)

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'RC Cars', href: '/products?category=remote-controlled' },
  { name: 'Educational', href: '/products?category=educational-toys' },
  { name: 'Water Toys', href: '/products?category=water-toys' },
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/80 dark:bg-surface-950/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
    <div class="container-app">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Logo & Mobile Menu Toggle -->
        <div class="flex items-center gap-4">
          <button @click="toggleMenu" class="lg:hidden p-2 -ml-2 text-surface-600 dark:text-surface-300">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-2xl font-display font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              FamilyCorner
            </span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-8">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="text-sm font-medium text-surface-600 hover:text-brand-600 dark:text-surface-300 dark:hover:text-brand-400 transition-colors"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Search, Cart, Account -->
        <div class="flex items-center gap-2 sm:gap-4">
          <button class="p-2 text-surface-600 hover:text-brand-600 dark:text-surface-300 dark:hover:text-brand-400 transition-colors hidden sm:block">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <NuxtLink to="/cart" class="relative p-2 text-surface-600 hover:text-brand-600 dark:text-surface-300 dark:hover:text-brand-400 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <UiBadge v-if="cartStore.itemCount > 0" variant="brand" size="sm" class="absolute top-0 right-0 px-1 min-w-[1.25rem] text-center border border-white dark:border-surface-950">
              {{ cartStore.itemCount }}
            </UiBadge>
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink :to="authStore.isSeller ? '/seller' : authStore.isAdmin ? '/admin' : '/dashboard'" class="hidden sm:flex items-center gap-2 p-1 pr-3 rounded-full border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
              <div class="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">
                {{ authStore.userInitials }}
              </div>
              <span class="text-sm font-medium hidden md:block text-surface-700 dark:text-surface-300">{{ authStore.userName }}</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="hidden sm:block text-sm font-medium text-surface-600 hover:text-brand-600 dark:text-surface-300 transition-colors">
              Log in
            </NuxtLink>
            <UiButton size="sm" @click="$router.push('/auth/signup')">Sign up</UiButton>
          </template>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="isMenuOpen" class="lg:hidden py-4 border-t border-surface-200 dark:border-surface-800">
        <nav class="flex flex-col gap-4">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="text-base font-medium text-surface-600 dark:text-surface-300 hover:text-brand-600 transition-colors"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
          <hr class="border-surface-200 dark:border-surface-700 my-2" />
          <template v-if="authStore.isAuthenticated">
             <NuxtLink :to="authStore.isSeller ? '/seller' : authStore.isAdmin ? '/admin' : '/dashboard'" class="text-base font-medium text-surface-600 dark:text-surface-300 hover:text-brand-600 transition-colors" @click="isMenuOpen = false">
              My Dashboard
            </NuxtLink>
             <button @click="authStore.logout(); isMenuOpen = false" class="text-left text-base font-medium text-danger-600 dark:text-danger-400 hover:text-danger-700 transition-colors">
              Log out
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="text-base font-medium text-surface-600 dark:text-surface-300 hover:text-brand-600 transition-colors" @click="isMenuOpen = false">
              Log in
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="text-base font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors" @click="isMenuOpen = false">
              Sign up
            </NuxtLink>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>
