import type { ApiError, ApiResponse } from '~/types'
import { STORAGE_KEYS } from '~/constants'
import { secureStorage } from '~/utils'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
  retry?: number
  requireAuth?: boolean
}

/**
 * Type-safe API client built on $fetch with interceptors,
 * token refresh handling, retry logic, and error normalization.
 */
class ApiClient {
  private baseUrl: string = ''
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  initialize(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthHeaders(): Record<string, string> {
    const token = secureStorage.get(STORAGE_KEYS.accessToken)
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private normalizeError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'data' in error) {
      const data = (error as { data: Record<string, unknown> }).data
      const detail = data?.detail
      const message = Array.isArray(detail)
        ? detail.map((item: any) => item?.msg || item?.message).filter(Boolean).join(', ')
        : detail

      return {
        success: false,
        message: (message as string) || (data?.message as string) || 'An error occurred',
        errors: data?.errors as Record<string, string[]> | undefined,
        statusCode: (error as { status?: number }).status || 500,
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error. Please check your connection.',
      statusCode: 0,
    }
  }

  private async refreshTokens(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = (async () => {
      try {
        const refreshToken = secureStorage.get(STORAGE_KEYS.refreshToken)
        if (!refreshToken) return false

        const response = await $fetch<ApiResponse<{ access_token: string; refresh_token: string; expires_in: number }>>(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          body: { refresh_token: refreshToken },
          credentials: 'include',
        })

        if (response.success && response.data) {
          secureStorage.set(STORAGE_KEYS.accessToken, response.data.access_token)
          secureStorage.set(STORAGE_KEYS.refreshToken, response.data.refresh_token)
          return true
        }
        return false
      } catch {
        secureStorage.remove(STORAGE_KEYS.accessToken)
        secureStorage.remove(STORAGE_KEYS.refreshToken)
        return false
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, headers = {}, retry = 1, requireAuth = false } = options

    // Filter out undefined params
    const cleanParams: Record<string, string> = {}
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) cleanParams[key] = String(value)
      }
    }

    const url = `${this.baseUrl}${endpoint}`
    const authHeaders = requireAuth ? this.getAuthHeaders() : {}
    const isFormData = body instanceof FormData
    try {
      const response = await $fetch<T>(url, {
        method,
        body: body || undefined,
        params: Object.keys(cleanParams).length ? cleanParams : undefined,
        credentials: 'include',
        headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...authHeaders,
          ...headers,
        },
      })

      return response
    } catch (error: unknown) {
      // Handle 401 — try token refresh
      if ((error as { status?: number })?.status === 401 && requireAuth) {
        const refreshed = await this.refreshTokens()
        if (refreshed) {
          return this.request<T>(endpoint, { ...options, retry: 0 })
        }
        // Token refresh failed — navigate to login
        if (import.meta.client) {
          navigateTo('/auth/login')
        }
      }

      // Retry on network failures
      if (retry > 0 && (error as { status?: number })?.status !== 401) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.request<T>(endpoint, { ...options, retry: retry - 1 })
      }

      throw this.normalizeError(error)
    }
  }

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, requireAuth = false) {
    return this.request<T>(endpoint, { method: 'GET', params, requireAuth })
  }

  post<T>(endpoint: string, body?: unknown, requireAuth = false) {
    return this.request<T>(endpoint, { method: 'POST', body, requireAuth })
  }

  put<T>(endpoint: string, body?: unknown, requireAuth = false) {
    return this.request<T>(endpoint, { method: 'PUT', body, requireAuth })
  }

  patch<T>(endpoint: string, body?: unknown, requireAuth = false) {
    return this.request<T>(endpoint, { method: 'PATCH', body, requireAuth })
  }

  delete<T>(endpoint: string, requireAuth = true) {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth })
  }
}

export const apiClient = new ApiClient()
export default apiClient
