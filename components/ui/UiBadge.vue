<script setup lang="ts">
type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

interface Props {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'brand',
  size: 'md',
  dot: false,
})

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  neutral: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
}

const dotColors: Record<BadgeVariant, string> = {
  brand: 'bg-brand-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-surface-400',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-0.5 text-xs',
      variantClasses[variant],
    ]"
  >
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full', dotColors[variant]]" />
    <slot />
  </span>
</template>
