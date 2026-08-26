import { STORAGE_KEYS } from '~/constants'
import { useAuthStore } from '~/stores/auth'
import { secureStorage } from '~/utils'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const hasStoredToken = !!secureStorage.get(STORAGE_KEYS.accessToken)
  
  // Routes that require authentication
  const requiresAuth = to.path.startsWith('/dashboard') || 
                       to.path.startsWith('/seller') || 
                       to.path.startsWith('/admin')

  // If user is not authenticated and tries to access protected route
  if (requiresAuth && !authStore.user && !hasStoredToken) {
    return navigateTo(`/auth/login?redirect=${to.fullPath}`)
  }

  // Role-based access control
  if (authStore.user && to.path.startsWith('/seller') && authStore.user.role !== 'seller' && authStore.user.role !== 'admin') {
    return navigateTo('/dashboard')
  }

  if (authStore.user && to.path.startsWith('/admin') && authStore.user.role !== 'admin') {
    return navigateTo('/')
  }

  // Redirect authenticated users away from auth pages
  if (to.path.startsWith('/auth/') && authStore.user) {
    if (authStore.user.role === 'admin') return navigateTo('/admin')
    if (authStore.user.role === 'seller') return navigateTo('/seller')
    return navigateTo('/dashboard')
  }
})
