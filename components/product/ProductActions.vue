<script setup lang="ts">
const props = defineProps<{
    product: BackendProduct
}>()

const emit = defineEmits([
    'delete'
])
</script>

<template>
<div class="flex gap-2">
{{ `/seller/products/${product.slug}/edit` }}
    <NuxtLink
        :to="`/seller/products/${product.slug}/edit`"
    >
        <UiButton
            size="sm"
            variant="secondary"
        >
            Edit
        </UiButton>
    </NuxtLink>

    <UiButton
        size="sm"
        color="danger"
        @click="$emit('delete', product)"
    >
        Delete
    </UiButton>

</div>
</template>