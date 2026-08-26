<script setup lang="ts">
import { formatPrice } from '~/utils'
import type { Order } from '~/types'

const props = defineProps<{
  order: Order | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning'
    case 'processing':
      return 'brand'
    case 'confirmed':
      return 'brand'
    case 'shipped':
      return 'success'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'neutral'
  }
}

const getPaymentStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'authorized':
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
    case 'refunded':
      return 'danger'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && order"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="emit('close')"
      />

      <!-- Modal -->
      <div
        class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-surface-900 shadow-2xl"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-surface-200 dark:border-surface-800"
        >
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-bold">
                Order {{ order.orderNumber }}
              </h2>

              <UiBadge
                :variant="getStatusVariant(order.status)"
                size="sm"
                class="capitalize"
              >
                {{ order.status }}
              </UiBadge>
            </div>

            <p class="text-sm text-surface-500 mt-1">
              Placed {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-145px)] p-6 space-y-6">

          <!-- Order Summary -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              class="rounded-xl border border-surface-200 dark:border-surface-800 p-4"
            >
              <p class="text-sm text-surface-500">
                Order Status
              </p>

              <div class="mt-2">
                <UiBadge
                  :variant="getStatusVariant(order.status)"
                  class="capitalize"
                >
                  {{ order.status }}
                </UiBadge>
              </div>
            </div>

            <div
              class="rounded-xl border border-surface-200 dark:border-surface-800 p-4"
            >
              <p class="text-sm text-surface-500">
                Payment Status
              </p>

              <div class="mt-2">
                <UiBadge
                  :variant="getPaymentStatusVariant(order.paymentStatus)"
                  class="capitalize"
                >
                  {{ order.paymentStatus }}
                </UiBadge>
              </div>
            </div>

            <div
              class="rounded-xl border border-surface-200 dark:border-surface-800 p-4"
            >
              <p class="text-sm text-surface-500">
                Order Total
              </p>

              <p class="mt-1 text-xl font-bold">
                {{ formatPrice(Number(order.totalAmount)) }}
              </p>
            </div>
          </div>

          <!-- Order Information -->
          <div>
            <h3 class="text-lg font-semibold mb-4">
              Order Information
            </h3>

            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-surface-200 dark:border-surface-800 p-5"
            >
              <div>
                <p class="text-sm text-surface-500">
                  Order Number
                </p>
                <p class="font-medium mt-1">
                  {{ order.orderNumber }}
                </p>
              </div>

              <div>
                <p class="text-sm text-surface-500">
                  Order ID
                </p>
                <p class="font-medium mt-1 break-all">
                  {{ order.id }}
                </p>
              </div>

              <div>
                <p class="text-sm text-surface-500">
                  Created At
                </p>
                <p class="font-medium mt-1">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>

              <div>
                <p class="text-sm text-surface-500">
                  Last Updated
                </p>
                <p class="font-medium mt-1">
                  {{ formatDate(order.updatedAt) }}
                </p>
              </div>

              <div>
                <p class="text-sm text-surface-500">
                  Payment
                </p>
                <p class="font-medium mt-1 capitalize">
                  {{ order.paymentStatus }}
                </p>
              </div>
            </div>
          </div>

          <!-- Products -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">
                Order Items
              </h3>

              <span class="text-sm text-surface-500">
                {{ order.items.length }}
                {{ order.items.length === 1 ? 'item' : 'items' }}
              </span>
            </div>

            <div
              class="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden"
            >
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead
                    class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800"
                  >
                    <tr class="text-sm text-surface-500">
                      <th class="px-5 py-3">
                        Product
                      </th>

                      <th class="px-5 py-3">
                        Variant
                      </th>

                      <th class="px-5 py-3 text-center">
                        Qty
                      </th>

                      <th class="px-5 py-3 text-right">
                        Unit Price
                      </th>

                      <th class="px-5 py-3 text-right">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    class="divide-y divide-surface-200 dark:divide-surface-800"
                  >
                    <tr
                      v-for="item in order.items"
                      :key="item.id"
                    >
                      <td class="px-5 py-4">
                        <div class="font-medium">
                          {{ item.productName }}
                        </div>

                        <div class="text-xs text-surface-500 mt-1">
                          {{ item.productId }}
                        </div>
                      </td>

                      <td class="px-5 py-4 text-sm text-surface-500">
                        {{ item.variantName || '—' }}
                      </td>

                      <td class="px-5 py-4 text-center">
                        {{ item.quantity }}
                      </td>

                      <td class="px-5 py-4 text-right">
                        {{ formatPrice(Number(item.unitPrice)) }}
                      </td>

                      <td class="px-5 py-4 text-right font-semibold">
                        {{ formatPrice(Number(item.totalPrice)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div>
            <h3 class="text-lg font-semibold mb-4">
              Payment Summary
            </h3>

            <div
              class="ml-auto w-full sm:w-96 rounded-xl border border-surface-200 dark:border-surface-800 p-5 space-y-3"
            >
              <div class="flex justify-between text-sm">
                <span class="text-surface-500">
                  Subtotal
                </span>

                <span>
                  {{ formatPrice(Number(order.subtotal)) }}
                </span>
              </div>


              <div class="flex justify-between text-sm">
                <span class="text-surface-500">
                  Shipping
                </span>

                <span>
                  {{ formatPrice(Number(order.shippingAmount)) }}
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-surface-500">
                  Discount
                </span>

                <span class="text-success-600">
                  -{{ formatPrice(Number(order.discountAmount)) }}
                </span>
              </div>

              <div
                class="pt-3 mt-3 border-t border-surface-200 dark:border-surface-800"
              >
                <div class="flex justify-between">
                  <span class="font-semibold">
                    Total
                  </span>

                  <span class="text-xl font-bold">
                    {{ formatPrice(Number(order.totalAmount)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div
          class="flex justify-end px-6 py-4 border-t border-surface-200 dark:border-surface-800"
        >
          <UiButton
            variant="outline"
            @click="emit('close')"
          >
            Close
          </UiButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>