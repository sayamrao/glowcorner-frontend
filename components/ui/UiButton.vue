<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
  icon: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md focus-visible:ring-brand-500',
  secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200 active:bg-surface-300 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700',
  outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 active:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-950',
  ghost: 'text-surface-600 hover:bg-surface-100 active:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-800',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-red-700 shadow-sm',
  success: 'bg-success-500 text-white hover:bg-success-600 active:bg-green-700 shadow-sm',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs px-2.5 py-1 gap-1 rounded-lg',
  sm: 'text-sm px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 gap-2 rounded-xl',
  lg: 'text-base px-5 py-2.5 gap-2 rounded-xl',
  xl: 'text-lg px-6 py-3 gap-2.5 rounded-xl',
}

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: 'p-1 rounded-lg',
  sm: 'p-1.5 rounded-lg',
  md: 'p-2 rounded-xl',
  lg: 'p-2.5 rounded-xl',
  xl: 'p-3 rounded-xl',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium transition-all duration-200 select-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  variantClasses[props.variant],
  props.icon ? iconSizeClasses[props.size] : sizeClasses[props.size],
  props.fullWidth ? 'w-full' : '',
])

function handleClick(event: MouseEvent) {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>

    <slot v-if="!loading || !icon" />
  </button>
</template>
