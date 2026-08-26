<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  label: '',
  error: '',
  hint: '',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const generatedId = useId()
const inputId = computed(() => props.id || generatedId)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-surface-700 dark:text-surface-300"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 ml-0.5">*</span>
    </label>

    <div class="relative">
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        :class="[
          'block w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-all duration-200',
          'placeholder:text-surface-400',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-50',
          'dark:bg-surface-800 dark:text-surface-100',
          error
            ? 'border-danger-400 focus:ring-danger-500/20 focus:border-danger-500'
            : 'border-surface-300 dark:border-surface-600 focus:ring-brand-500/20 focus:border-brand-500',
          $slots.prefix ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : '',
        ]"
        @input="handleInput"
      />

      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400">
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" :id="`${inputId}-error`" class="text-xs text-danger-500 flex items-center gap-1" role="alert">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="text-xs text-surface-500">
      {{ hint }}
    </p>
  </div>
</template>
