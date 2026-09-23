<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { createProduct, updateProduct, uploadProductImage } from '~/services/commerce'
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

const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isUploadingImages = ref(false)

const existingMedia = computed(() => {
  if (props.mode !== "edit" || !props.product?.media) return []

  return [...props.product.media].sort(
    (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )
})

const totalImageCount = computed(
  () => existingMedia.value.length + imageFiles.value.length
)

const MAX_IMAGES = 8
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB

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


function selectImages(event: Event) {
  const input = event.target as HTMLInputElement

  if (!input.files) return

  const files = Array.from(input.files)

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Invalid Image",
        `${file.name} is not a valid image.`
      )
      continue
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(
        "Image Too Large",
        `${file.name} must be smaller than 10 MB.`
      )
      continue
    }

    if (totalImageCount.value >= MAX_IMAGES) {
      toast.error(
        "Maximum Images",
        `You can upload up to ${MAX_IMAGES} images in total.`
      )
      break
    }

    imageFiles.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  }

  // Allows selecting the same file again
  input.value = ""
}

function removeSelectedImage(index: number) {
  URL.revokeObjectURL(imagePreviews.value[index])

  imageFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

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
    let savedProduct: any
    if (props.mode === "create") {
      savedProduct = await createProduct(payload)

      toast.success(
        "Product Created",
        "Your product has been created."
      )
    } else {
      savedProduct = await updateProduct(props.product.id, payload)

      toast.success(
        "Product Updated",
        "Product updated successfully."
      )
    }

    const productId =
      savedProduct?.data?.id ??
      savedProduct?.data?.data?.id ??
      savedProduct?.id ??
      props.product?.id

    if (!productId) {
      throw new Error(
        "Product was saved, but no product ID was returned."
      )
    }
     // -----------------------------------------
    // Upload images
    // -----------------------------------------

    if (imageFiles.value.length > 0) {
      isUploadingImages.value = true

      for (const file of imageFiles.value) {
        console.log("uploadign image")
        await uploadProductImage(
          productId,
          file
        )
      }

      isUploadingImages.value = false
    }


    emit("saved")
  } catch (e: any) {
    isUploadingImages.value = false
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

    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          Product Images
        </h3>

        <p class="text-sm text-gray-500 mt-1">
          Upload up to {{ MAX_IMAGES }} images. JPG, PNG or WebP.
          Maximum 10 MB each.
        </p>
      </div>

      <div
        class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition"
      >
        <input
          id="product-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="hidden"
          @change="selectImages"
        />

        <label
          for="product-images"
          class="cursor-pointer flex flex-col items-center"
        >
          <div class="text-gray-500">
            Click to select product images
          </div>

          <div class="text-sm text-gray-400 mt-1">
            JPG, PNG or WebP
          </div>
        </label>
      </div>

      <!-- Existing images -->
      <div v-if="existingMedia.length" class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">
          Current images ({{ existingMedia.length }}/{{ MAX_IMAGES }})
        </h4>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            v-for="image in existingMedia"
            :key="image.id"
            class="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
          >
            <img
              :src="mediaUrl(image.url)"
              :alt="image.alt_text || 'Product image'"
              class="w-full h-full object-cover"
            />

            <div
              v-if="image.is_primary"
              class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1"
            >
              Primary image
            </div>
          </div>
        </div>
      </div>

      <!-- Newly selected images -->
      <div
        v-if="imagePreviews.length"
        class="space-y-2"
      >
        <h4 class="text-sm font-medium text-gray-700">
          New images ({{ totalImageCount }}/{{ MAX_IMAGES }})
        </h4>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="(preview, index) in imagePreviews"
          :key="preview"
          class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
        >
          <img
            :src="preview"
            class="w-full h-full object-cover"
            alt="Product preview"
          />

          <button
            type="button"
            class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            @click="removeSelectedImage(index)"
          >
            ×
          </button>

          <div
            v-if="existingMedia.length === 0 && index === 0"
            class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1"
          >
            Primary image
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-4">

      <UiButton
        variant="outline"
        type="button"
      >
        Cancel
      </UiButton>

      <UiButton
        type="submit"
        :loading="isSubmitting || isUploadingImages"
      >
        {{
          isUploadingImages
            ? "Uploading Images..."
            : mode === "create"
              ? "Create Product"
              : "Update Product"
        }}
      </UiButton>

    </div>

  </form>
</template>