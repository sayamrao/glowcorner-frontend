<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { formatPrice } from '~/utils'
import { useToast } from '~/composables/useToast'
import { CITIES_PAKISTAN } from '~/constants'
import { createGuestOrder } from '~/services/commerce'
import type { GuestCheckoutPayload } from '~/types'


const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

const step = ref<1 | 2>(1)
const isProcessing = ref(false)

// Form state
const form = reactive({
  name: '',
  phone: '',
  email: '',
  street: '',
  city: CITIES_PAKISTAN[0],
  state: '',
  zip: '',
  paymentMethod: 'cod' as 'cod' | 'jazzcash' | 'easypaisa',
})

// Mock Payment State
const mockPaymentState = reactive({
  show: false,
  phone: '',
  pin: '',
})

const isFormValid = computed(() => {
  return form.name && form.phone && form.street && form.city && form.state
})

function submitShipping() {
  if (isFormValid.value) {
    step.value = 2
  } else {
    toast.error('Validation Error', 'Please fill in all required shipping fields.')
  }
}

async function placeOrder() {
  if (form.paymentMethod === 'cod') {
    await processOrder()
  } else {
    // Show mock payment modal for JazzCash/EasyPaisa
    mockPaymentState.phone = form.phone
    mockPaymentState.show = true
  }
}

async function processMockPayment() {
  if (!mockPaymentState.pin) {
    toast.error('Error', 'Please enter your PIN')
    return
  }
  
  mockPaymentState.show = false
  await processOrder()
}

// async function processOrder() {
//   // if (!authStore.isAuthenticated) {
//   //   toast.error('Login Required', 'Please log in before placing your order.')
//   //   navigateTo('/auth/login?redirect=/checkout')
//   //   return
//   // }

//   isProcessing.value = true
  
//   try {
//     const address = await createCheckoutAddress(form)
//     await createOrder({
//       shippingAddressId: address.id,
//       billingAddressId: address.id,
//       paymentMethod: form.paymentMethod,
//       notes: form.email ? `Checkout email: ${form.email}` : undefined,
//     })

//     toast.success('Order Placed Successfully!', 'Your order has been confirmed.')
//     cartStore.clearCart()
//     navigateTo('/dashboard/orders')
//   } catch (error: any) {
//     toast.error('Order Failed', error?.message || 'There was an issue processing your order. Please try again.')
//   } finally {
//     isProcessing.value = false
//   }
// }

async function processOrder() {
  isProcessing.value = true

  try {
    const payload: GuestCheckoutPayload = {
    customer: {
    full_name: form.name,
    phone: form.phone,
    email: form.email || null,
    },

    shipping_address: {
      address_line1: form.street,
      city: form.city,
      postal_code: form.zip || null,
      country: form.country || 'Pakistan',
    },

      items: cartStore.items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
      })),

      payment_method: form.paymentMethod,
    }

    const order = await createGuestOrder(payload)

    toast.success(
      'Order Placed Successfully!',
      'Your order has been confirmed.',
    )


    secureStorage.set(
      'lastOrder',
      JSON.stringify({
        id: order.id,
        orderNumber: order.order_number,
        total: order.total_amount,
        currency: 'PKR',
      }),
    )

    cartStore.clearCart()

    navigateTo(`/order-success?orderNumber=${order.order_number}`)

  } catch (error: any) {
    toast.error(
    'Order Failed',
    error?.message ||
    'There was an issue processing your order. Please try again.',
    )
  } finally {
    isProcessing.value = false
  }
}


// Redirect if cart is empty
onMounted(() => {
  if (cartStore.isEmpty) {
    navigateTo('/cart')
  }
  cartStore.loadFromStorage()
  // if (!authStore.isAuthenticated) {
  //   navigateTo('/auth/login?redirect=/checkout')
  // }
})

useHead({
  title: 'Checkout',
})
</script>

<template>
  <div class="container-app py-8 md:py-12 bg-surface-50 dark:bg-surface-950 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-display font-bold mb-8 text-center">Secure Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Main Checkout Form -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          
          <!-- Step 1: Shipping -->
          <div class="bg-white dark:bg-surface-900 rounded-3xl p-6 md:p-8 shadow-card border border-surface-200 dark:border-surface-800 transition-all" :class="{'opacity-50 pointer-events-none': step === 2}">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm">1</span>
                Shipping Details
              </h2>
              <button v-if="step === 2" @click="step = 1" class="text-sm font-medium text-brand-600 hover:text-brand-700">Edit</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiInput v-model="form.name" label="Full Name" required placeholder="Ali Khan" />
              <UiInput v-model="form.phone" label="Phone Number" required placeholder="03XX XXXXXXX" />
              <UiInput v-model="form.email" label="Email Address" type="email" placeholder="Optional for guest" class="md:col-span-2" />
              <UiInput v-model="form.street" label="Street Address" required placeholder="House, Street, Area" class="md:col-span-2" />
              
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">City <span class="text-danger-500">*</span></label>
                <select v-model="form.city" class="block w-full rounded-xl border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm focus:ring-brand-500 focus:border-brand-500">
                  <option v-for="city in CITIES_PAKISTAN" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
              
              <UiInput v-model="form.state" label="Province/State" required placeholder="Sindh, Punjab..." />
              <UiInput v-model="form.zip" label="Zip/Postal Code" placeholder="75600" />
            </div>

            <div v-if="step === 1" class="mt-8 flex justify-end">
              <UiButton size="lg" @click="submitShipping">Continue to Payment</UiButton>
            </div>
          </div>

          <!-- Step 2: Payment -->
          <div class="bg-white dark:bg-surface-900 rounded-3xl p-6 md:p-8 shadow-card border border-surface-200 dark:border-surface-800 transition-all" :class="{'opacity-50 pointer-events-none': step === 1}">
             <h2 class="text-xl font-bold flex items-center gap-3 mb-6">
                <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors" :class="step === 2 ? 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-400'">2</span>
                Payment Method
              </h2>

              <div class="space-y-4">
                <!-- COD -->
                <label class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors" :class="form.paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'">
                  <div class="flex items-center gap-4">
                    <input type="radio" v-model="form.paymentMethod" value="cod" class="w-5 h-5 text-brand-600 focus:ring-brand-500 border-surface-300" />
                    <div>
                      <p class="font-bold text-surface-900 dark:text-white">Cash on Delivery (COD)</p>
                      <p class="text-sm text-surface-500">Pay at your doorstep when you receive your order</p>
                    </div>
                  </div>
                  <span class="text-2xl">💵</span>
                </label>

                <!-- JazzCash -->
                <label class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors" :class="form.paymentMethod === 'jazzcash' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'">
                  <div class="flex items-center gap-4">
                    <input type="radio" v-model="form.paymentMethod" value="jazzcash" class="w-5 h-5 text-brand-600 focus:ring-brand-500 border-surface-300" />
                    <div>
                      <p class="font-bold text-surface-900 dark:text-white">JazzCash Auto</p>
                      <p class="text-sm text-surface-500">Instant mobile wallet payment</p>
                    </div>
                  </div>
                  <span class="text-2xl font-bold text-red-600 tracking-tighter">JAZZ</span>
                </label>

                <!-- EasyPaisa -->
                <label class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors" :class="form.paymentMethod === 'easypaisa' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'">
                  <div class="flex items-center gap-4">
                    <input type="radio" v-model="form.paymentMethod" value="easypaisa" class="w-5 h-5 text-brand-600 focus:ring-brand-500 border-surface-300" />
                    <div>
                      <p class="font-bold text-surface-900 dark:text-white">EasyPaisa</p>
                      <p class="text-sm text-surface-500">Fast and secure mobile payment</p>
                    </div>
                  </div>
                  <span class="text-2xl font-bold text-green-500 tracking-tighter">eP</span>
                </label>
              </div>

              <div v-if="step === 2" class="mt-8 flex justify-end">
                <UiButton size="lg" variant="primary" :loading="isProcessing" @click="placeOrder" class="w-full sm:w-auto">
                  Confirm Order — {{ formatPrice(cartStore.total) }}
                </UiButton>
              </div>
          </div>
        </div>

        <!-- Sidebar Summary -->
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="bg-white dark:bg-surface-900 rounded-3xl p-6 shadow-card border border-surface-200 dark:border-surface-800 sticky top-24">
            <h3 class="font-bold text-lg mb-4">Order Summary</h3>
            
            <!-- Items Scroll -->
            <div class="max-h-60 overflow-y-auto space-y-3 mb-6 pr-2 scrollbar-hide">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3 text-sm">
                <div class="relative w-12 h-12 rounded bg-surface-100 dark:bg-surface-800 overflow-hidden shrink-0">
                  <img :src="item.productImage" alt="" class="w-full h-full object-cover" />
                  <span class="absolute -top-1 -right-1 bg-surface-900 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">{{ item.quantity }}</span>
                </div>
                <div class="flex-grow min-w-0">
                  <p class="font-medium line-clamp-1">{{ item.productName }}</p>
                  <p class="text-surface-500 text-xs">{{ item.variantName }}</p>
                </div>
                <div class="font-medium shrink-0">{{ formatPrice(item.price * item.quantity) }}</div>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-3 pt-4 border-t border-surface-200 dark:border-surface-800 text-sm">
               <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Subtotal</span>
                <span>{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Shipping</span>
                <span :class="{'text-success-600': cartStore.shipping === 0}">
                  {{ cartStore.shipping === 0 ? 'Free' : formatPrice(cartStore.shipping) }}
                </span>
              </div>
               <div v-if="cartStore.discount > 0" class="flex justify-between text-success-600">
                <span>Discount</span>
                <span>-{{ formatPrice(cartStore.discount) }}</span>
              </div>
              
              <div class="pt-3 border-t border-surface-200 dark:border-surface-800 flex justify-between items-center">
                <span class="font-bold text-base">Total</span>
                <span class="text-xl font-bold text-brand-600 dark:text-brand-400">{{ formatPrice(cartStore.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mock Payment Modal -->
    <UiModal v-model="mockPaymentState.show" persistent title="Complete Mobile Payment">
      <div class="space-y-4">
        <div class="p-4 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-xl text-sm text-center">
          Please confirm payment of <strong>{{ formatPrice(cartStore.total) }}</strong> to FamilyCorner via {{ form.paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa' }}.
        </div>
        
        <UiInput v-model="mockPaymentState.phone" label="Mobile Account Number" disabled />
        <UiInput v-model="mockPaymentState.pin" label="Enter MPIN" type="password" placeholder="****" />
        
        <div class="flex gap-3 pt-4">
          <UiButton variant="outline" fullWidth @click="mockPaymentState.show = false">Cancel</UiButton>
          <UiButton variant="primary" fullWidth :loading="isProcessing" @click="processMockPayment">Confirm Payment</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>
