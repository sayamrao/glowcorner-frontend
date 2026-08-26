<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import type { UserRole } from '~/types'

const authStore = useAuthStore()
const toast = useToast()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const role = ref<UserRole>('customer')

async function handleSignup() {
  if (!name.value || !email.value || !password.value) {
    toast.error('Validation Error', 'Please fill in all required fields')
    return
  }

  try {
    const user = await authStore.signup({ 
      name: name.value,
      email: email.value, 
      phone: phone.value,
      password: password.value,
      role: role.value,
    })
    
    toast.success('Account Created', `Welcome to FamilyCorner, ${user.name}!`)
    
    // Redirect based on role
    if (user.role === 'seller') navigateTo('/seller')
    else navigateTo('/dashboard')
  } catch (err: any) {
    toast.error('Signup Failed', err.message || 'An error occurred')
  }
}

useHead({
  title: 'Sign Up',
})
</script>

<template>
  <div class="container-app py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl p-8 shadow-card border border-surface-200 dark:border-surface-800">
      
      <div class="text-center mb-8">
        <h1 class="text-2xl font-display font-bold mb-2">Create Account</h1>
        <p class="text-surface-500">Join FamilyCorner marketplace today</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
           <label class="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors" :class="role === 'customer' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'">
            <input type="radio" v-model="role" value="customer" class="sr-only" />
            <span class="font-medium text-sm">Customer</span>
          </label>
          <label class="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors" :class="role === 'seller' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'">
            <input type="radio" v-model="role" value="seller" class="sr-only" />
            <span class="font-medium text-sm">Seller</span>
          </label>
        </div>

        <UiInput v-model="name" label="Full Name" required placeholder="Ali Khan" />
        <UiInput v-model="email" label="Email Address" type="email" required placeholder="you@example.com" />
        <UiInput v-model="phone" label="Phone Number" placeholder="03XX XXXXXXX" />
        <UiInput v-model="password" label="Password" type="password" required placeholder="••••••••" hint="Must be at least 8 characters" />

        <UiButton type="submit" size="lg" fullWidth :loading="authStore.isLoading" class="mt-6">
          Create Account
        </UiButton>
      </form>

      <div class="mt-6 pt-6 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-600 dark:text-surface-400">
        Already have an account? 
        <NuxtLink to="/auth/login" class="font-medium text-brand-600 hover:text-brand-700">Log in</NuxtLink>
      </div>
    </div>
  </div>
</template>
