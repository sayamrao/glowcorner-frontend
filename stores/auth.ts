import { defineStore } from 'pinia'
import type { User, AuthTokens, UserRole, LoginPayload, SignupPayload } from '~/types'
import { STORAGE_KEYS } from '~/constants'
import { secureStorage } from '~/utils'
import { apiClient } from '~/services/api'
import { mapBackendUser, mapSignupPayload } from '~/services/commerce'
interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.tokens,
    userRole: (state): UserRole | null => state.user?.role ?? null,
    isCustomer: (state) => state.user?.role === 'customer',
    isSeller: (state) => state.user?.role === 'seller',
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name ?? '',
    userInitials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
  },

  actions: {
    /**
     * Initialize auth state from stored tokens (called on app start)
     */
    initialize() {
      const accessToken = secureStorage.get(STORAGE_KEYS.accessToken)
      const refreshToken = secureStorage.get(STORAGE_KEYS.refreshToken)

      if (accessToken && refreshToken) {
        this.tokens = { accessToken, refreshToken, expiresAt: Date.now() + 3600000 }
        this.fetchProfile()
      }
    },

    /**
     * Login with email and password
     * In production: calls POST /auth/login
     */
    async login(payload: LoginPayload) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post<{ data: { access_token: string; refresh_token: string; expires_in: number } }>('/auth/login', payload)

        const tokens: AuthTokens = {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          expiresAt: Date.now() + (response.data.expires_in * 1000),
        }

        this.tokens = tokens
        secureStorage.set(STORAGE_KEYS.accessToken, tokens.accessToken)
        secureStorage.set(STORAGE_KEYS.refreshToken, tokens.refreshToken)

        await this.fetchProfile()
        return this.user
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Login failed'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Register new user
     */
    async signup(payload: SignupPayload) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post<{ data: { user: any; tokens: { access_token: string; refresh_token: string; expires_in: number } } }>('/auth/register', mapSignupPayload(payload))

        const tokens: AuthTokens = {
          accessToken: response.data.tokens.access_token,
          refreshToken: response.data.tokens.refresh_token,
          expiresAt: Date.now() + (response.data.tokens.expires_in * 1000),
        }

        this.tokens = tokens
        secureStorage.set(STORAGE_KEYS.accessToken, tokens.accessToken)
        secureStorage.set(STORAGE_KEYS.refreshToken, tokens.refreshToken)

        if (payload.phone) {
          const [firstName, ...lastName] = payload.name.trim().split(/\s+/)
          await apiClient.patch('/users/me/profile', {
            first_name: firstName || undefined,
            last_name: lastName.join(' ') || undefined,
            phone: payload.phone,
          }, true)
        }

        await this.fetchProfile()
        return this.user
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Signup failed'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch user profile
     */
    async fetchProfile() {
      try {
        const response = await apiClient.get<{ data: any }>('/auth/me', undefined, true)
        
        this.user = mapBackendUser(response.data)
      } catch {
        this.logout()
      }
    },

    /**
     * Logout and clear all auth state
     */
    async logout() {
      try {
        const refreshToken = secureStorage.get(STORAGE_KEYS.refreshToken)
        if (refreshToken) {
          await apiClient.post('/auth/logout', { refresh_token: refreshToken })
        }
      } catch {
        // Ignore logout errors
      } finally {
        this.user = null
        this.tokens = null
        this.error = null
        secureStorage.remove(STORAGE_KEYS.accessToken)
        secureStorage.remove(STORAGE_KEYS.refreshToken)
        if (import.meta.client) {
          navigateTo('/auth/login')
        }
      }
    },
  },
})
