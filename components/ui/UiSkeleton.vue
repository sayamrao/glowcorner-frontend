<script setup lang="ts">
interface Props {
  variant?: 'line' | 'rect' | 'circle'
  width?: string
  height?: string
  count?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'rect',
  width: '100%',
  height: '1rem',
  count: 1,
})
</script>

<template>
  <div class="space-y-2" role="status" aria-label="Loading">
    <div
      v-for="i in count"
      :key="i"
      :class="[
        'skeleton',
        variant === 'circle' ? 'rounded-full' : variant === 'line' ? 'rounded' : 'rounded-lg',
      ]"
      :style="{
        width: variant === 'circle' ? height : width,
        height,
      }"
    />
    <span class="sr-only">Loading...</span>
  </div>
</template>
