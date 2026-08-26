<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatPrice } from '~/utils'
import { secureStorage } from '~/utils'
import { STORAGE_KEYS } from '~/constants'

interface OrderSuccessData {
  id?: string
  orderNumber?: string
  total?: number
  currency?: string
}

const route = useRoute()

const order = ref<OrderSuccessData | null>(null)

onMounted(() => {
  // If order information was passed through query params
  if (route.query.orderNumber) {
    order.value = {
      orderNumber: String(route.query.orderNumber),
      total: route.query.total
        ? Number(route.query.total)
        : undefined,
      currency: 'PKR',
    }
    return
  }

  // Optional: retrieve saved order information
  const storedOrder = secureStorage.get('lastOrder')

  if (storedOrder) {
    try {
      order.value = JSON.parse(storedOrder)
    } catch {
      order.value = null
    }
  }
})

const orderNumber = computed(() => {
  return order.value?.orderNumber || 'Your order'
})

useHead({
  title: 'Order Confirmed - Family Corner',
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-2xl">

      <!-- Success Card -->
      <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-sm overflow-hidden">

        <!-- Success Header -->
        <div class="text-center px-6 sm:px-10 pt-10 pb-8">

          <!-- Success Icon -->
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-success-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white">
            Order Confirmed!
          </h1>

          <p class="mt-3 text-surface-500 dark:text-surface-400 text-base sm:text-lg">
            Thank you for your order. We've received your order successfully.
          </p>

          <!-- Order Number -->
          <div
            v-if="order?.orderNumber"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface-50 dark:bg-surface-800 px-5 py-3"
          >
            <span class="text-sm text-surface-500">
              Order #
            </span>

            <span class="font-bold text-brand-600 dark:text-brand-400">
              {{ order.orderNumber }}
            </span>
          </div>
        </div>

        <!-- Information -->
        <div class="border-t border-surface-200 dark:border-surface-800 px-6 sm:px-10 py-8">

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">

            <div>
              <div class="text-2xl mb-2">📦</div>
              <h3 class="font-semibold text-surface-900 dark:text-white">
                Order Received
              </h3>
              <p class="mt-1 text-sm text-surface-500">
                Your order is being prepared.
              </p>
            </div>

            <div>
              <div class="text-2xl mb-2">🚚</div>
              <h3 class="font-semibold text-surface-900 dark:text-white">
                Fast Delivery
              </h3>
              <p class="mt-1 text-sm text-surface-500">
                We'll deliver it to your address.
              </p>
            </div>

            <div>
              <div class="text-2xl mb-2">💬</div>
              <h3 class="font-semibold text-surface-900 dark:text-white">
                Stay Updated
              </h3>
              <p class="mt-1 text-sm text-surface-500">
                We'll contact you about your order.
              </p>
            </div>

          </div>

          <!-- Total -->
          <div
            v-if="order?.total !== undefined"
            class="mt-8 rounded-2xl bg-surface-50 dark:bg-surface-800/60 p-5"
          >
            <div class="flex items-center justify-between">
              <span class="text-surface-500">
                Order Total
              </span>

              <span class="text-xl font-bold text-surface-900 dark:text-white">
                {{ formatPrice(order.total) }}
              </span>
            </div>
          </div>

          <!-- Guest Notice -->
          <div class="mt-6 rounded-2xl border border-brand-200 bg-brand-50 dark:border-brand-900/50 dark:bg-brand-900/20 p-5">
            <div class="flex gap-3">
              <span class="text-xl">ℹ️</span>

              <div>
                <h3 class="font-semibold text-brand-900 dark:text-brand-300">
                  Keep your order number
                </h3>

                <p class="mt-1 text-sm text-brand-700 dark:text-brand-400">
                  Please keep your order number for future reference.
                  Our team may contact you regarding delivery.
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3">

            <NuxtLink
              to="/"
              class="flex-1"
            >
              <UiButton
                variant="primary"
                class="w-full"
              >
                Continue Shopping
              </UiButton>
            </NuxtLink>

            <NuxtLink
              to="/dashboard/orders"
              class="flex-1"
            >
              <UiButton
                variant="outline"
                class="w-full"
              >
                View My Orders
              </UiButton>
            </NuxtLink>

          </div>

        </div>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-surface-500">
        Thank you for shopping with
        <span class="font-semibold text-brand-600">
          Family Corner
        </span>
      </p>

    </div>
  </div>
</template>