<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { createProduct, updateProduct } from '~/services/commerce'
import { useToast } from '~/composables/useToast'
import ProductBasicInfo from "./ProductBasicInfo.vue"
import ProductPricing from "./ProductPricing.vue"
import ProductVariants from "./ProductVariants.vue"

interface VariantForm {
  sku: string
  name: string
  price: number
  compare_at_price: number | null
  inventory_quantity: number
  low_stock_threshold: number
  is_active: boolean
  attributes: Record<string, string>
}

interface ProductFormModel {
  name: string
  slug: string
  description: string
  short_description: string

  category_id: string | null
  brand_id: string | null

  base_price: number
  compare_at_price: number | null
  total_inventory: number

  status: string
  is_featured: boolean

  variants: VariantForm[]
}

const props = defineProps<{
  mode: "create" | "edit"
  product?: any

  categories: any[]
  brands: any[]
}>()

const emit = defineEmits<{
  saved: []
}>()


const authStore = useAuthStore()
const toast = useToast()
const isSubmitting = ref(false)
const apiError = ref('')

const form = reactive<ProductFormModel>({
  name: "",
  slug: "",

  description: "",
  short_description: "",

  category_id: null,
  brand_id: null,

  base_price: 0,
  compare_at_price: null,
  total_inventory: 0,

  status: "active",
  is_featured: false,

  variants: [],
})

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

watch(
  () => form.name,
  (value) => {
    if (props.mode === "create") {
      form.slug = slugify(value)
    }
  }
)

function parseVariantAttributes(variant: any): Record<string, string> {
  if (variant.attributes && typeof variant.attributes === "object") {
    return { ...variant.attributes }
  }

  if (variant.attributes_json) {
    try {
      return JSON.parse(variant.attributes_json)
    } catch {
      return {}
    }
  }

  return {}
}

function populateFormFromProduct(product: any) {
  Object.assign(form, {
    name: product.name ?? "",
    slug: product.slug ?? "",

    description: product.description ?? "",
    short_description: product.short_description ?? "",

    category_id: product.category_id ?? null,
    brand_id: product.brand_id ?? null,

    base_price: Number(product.base_price ?? 0),
    compare_at_price: product.compare_at_price != null
      ? Number(product.compare_at_price)
      : null,

    total_inventory: product.total_inventory ?? 0,

    status: product.status ?? "active",
    is_featured: product.is_featured ?? false,

    variants: (product.variants ?? []).map((v: any) => ({
      sku: v.sku ?? "",
      name: v.name ?? "",

      price: Number(v.price ?? 0),
      compare_at_price: v.compare_at_price != null
        ? Number(v.compare_at_price)
        : null,

      inventory_quantity: v.inventory_quantity ?? 0,
      low_stock_threshold: v.low_stock_threshold ?? 5,

      is_active: v.is_active ?? true,

      attributes: parseVariantAttributes(v),
    })),
  })
}

watch(
  () => props.product,
  (product) => {
    if (props.mode === "edit" && product) {
      populateFormFromProduct(product)
    }
  },
  { immediate: true }
)

watch(
  () => form.variants.map((variant) => variant.inventory_quantity),
  () => {
    if (form.variants.length === 0) return

    form.total_inventory = form.variants.reduce(
      (sum, variant) => sum + (variant.inventory_quantity || 0),
      0
    )
  },
  { deep: true }
)


function addVariant() {
  form.variants.push({
    sku: "",

    name: "",

    price: form.base_price,

    compare_at_price: form.compare_at_price,

    inventory_quantity: 0,

    low_stock_threshold: 5,

    is_active: true,

    attributes: {
      Color: "",
    },
  })
}


// const submitForm = async () => {
//   isSubmitting.value = true
//   apiError.value = ''

//   const payload = {
//     name: form.value.name,
//     description: form.value.description,
//     base_price: form.value.price,
//     compare_at_price: form.value.compareAtPrice || null,
//     category_id: form.value.category || null,
//     total_inventory: form.value.stock,
//     status: 'active',
//     is_featured: false,
//   }

//   try {
//     if (props.mode === 'create') {
//       await createProduct(payload)

//       toast.success(
//         'Product Added',
//         'Your product has been added successfully.'
//       )
//     } else {
//       await updateProduct(
//         props.product!.id,
//         payload
//       )

//       toast.success(
//         'Product Updated',
//         'Your product has been updated successfully.'
//       )
//     }

//     navigateTo('/seller/products')

//   } catch (error: any) {
//     apiError.value =
//       error?.message ||
//       `Failed to ${props.mode} product.`

//   } finally {
//     isSubmitting.value = false
//   }
// }

// useHead({
//   title: 'Add New Product - Seller Dashboard',
// })

function removeVariant(index: number) {
  form.variants.splice(index, 1)
}

function normalizeOptionalPrice(value: number | null | undefined): number | null {
  if (value == null || Number.isNaN(value) || value <= 0) {
    return null
  }

  return value
}

function buildPayload() {
  return {
    name: form.name,
    slug: form.slug,
    description: form.description || null,
    short_description: form.short_description || null,
    category_id: form.category_id || null,
    brand_id: form.brand_id || null,
    base_price: form.base_price,
    compare_at_price: normalizeOptionalPrice(form.compare_at_price),
    total_inventory: form.total_inventory,
    status: form.status,
    is_featured: form.is_featured,
    variants: form.variants.map((variant) => ({
      sku: variant.sku,
      name: variant.name || null,
      price: variant.price,
      compare_at_price: normalizeOptionalPrice(variant.compare_at_price),
      inventory_quantity: variant.inventory_quantity,
      low_stock_threshold: variant.low_stock_threshold,
      is_active: variant.is_active,
      attributes: variant.attributes,
    })),
  }
}

async function submit() {
  isSubmitting.value = true
  apiError.value = ""

  const payload = buildPayload()

  try {
    if (props.mode === "create") {
      await createProduct(payload)

      toast.success(
        "Product Created",
        "Your product has been created."
      )
    } else {
      await updateProduct(props.product.id, payload)

      toast.success(
        "Product Updated",
        "Product updated successfully."
      )
    }

    emit("saved")
  } catch (e: any) {
    apiError.value =
      e?.message ?? "Unable to save product."
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <form
    class="space-y-8"
    @submit.prevent="submit"
  >
    <div
      v-if="apiError"
      class="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700"
    >
      {{ apiError }}
    </div>

    <ProductBasicInfo
      v-model="form"
      :categories="categories"
      :brands="brands"
    />

    <ProductPricing
      v-model="form"
      :has-variants="form.variants.length > 0"
    />

    <ProductVariants
      :variants="form.variants"
      @add="addVariant"
      @remove="removeVariant"
    />

    <div class="flex justify-end gap-4">

      <UiButton
        variant="outline"
        type="button"
      >
        Cancel
      </UiButton>

      <UiButton
        type="submit"
        :loading="isSubmitting"
      >
        {{
          mode === "create"
            ? "Create Product"
            : "Update Product"
        }}
      </UiButton>

    </div>

  </form>
</template>