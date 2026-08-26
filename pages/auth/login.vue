<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.error('Validation Error', 'Please enter email and password')
    return
  }

  try {
    const user = await authStore.login({ email: email.value, password: password.value })
    toast.success('Welcome back!', `Logged in successfully as ${user.name}`)
    
    // Redirect based on role
    if (user.role === 'admin') navigateTo('/admin')
    else if (user.role === 'seller') navigateTo('/seller')
    else navigateTo('/dashboard')
  } catch (err: any) {
    toast.error('Login Failed', err.message || 'Invalid credentials')
  }
}

useHead({
  title: 'Log In',
})
</script>

<template>
  <div class="container-app py-12 md:py-24 flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl p-8 shadow-card border border-surface-200 dark:border-surface-800">
      
      <div class="text-center mb-8">
        <h1 class="text-2xl font-display font-bold mb-2">Welcome Back</h1>
        <p class="text-surface-500">Sign in to your FamilyCorner account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UiInput 
          v-model="email" 
          label="Email Address" 
          type="email" 
          required 
          placeholder="you@example.com" 
        />
        
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
            <NuxtLink to="/auth/forgot-password" class="text-xs font-medium text-brand-600 hover:text-brand-700">Forgot Password?</NuxtLink>
          </div>
          <UiInput 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••" 
          />
        </div>

        <UiButton type="submit" size="lg" fullWidth :loading="authStore.isLoading" class="mt-6">
          Log In
        </UiButton>
      </form>

      <div class="mt-6 pt-6 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-600 dark:text-surface-400">
        Don't have an account? 
        <NuxtLink to="/auth/signup" class="font-medium text-brand-600 hover:text-brand-700">Sign up</NuxtLink>
      </div>
      
      <div class="mt-8 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl text-xs text-surface-500 text-left space-y-2">
        <p class="font-bold mb-1">Demo Accounts:</p>
        <p>Customer: <code class="bg-surface-200 dark:bg-surface-700 px-1 rounded text-brand-600">user@family.pk</code></p>
        <p>Seller: <code class="bg-surface-200 dark:bg-surface-700 px-1 rounded text-brand-600">seller@family.pk</code></p>
        <p>Admin: <code class="bg-surface-200 dark:bg-surface-700 px-1 rounded text-brand-600">admin@family.pk</code></p>
        <p>Password: <code class="bg-surface-200 dark:bg-surface-700 px-1 rounded text-brand-600">any</code></p>
      </div>
    </div>
  </div>
</template>
