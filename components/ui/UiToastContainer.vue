<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const iconMap: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const colorMap: Record<ToastType, string> = {
  success: 'bg-success-500',
  error: 'bg-danger-500',
  warning: 'bg-warning-500',
  info: 'bg-brand-500',
}

const bgMap: Record<ToastType, string> = {
  success: 'bg-success-500/10 border-success-500/20',
  error: 'bg-danger-500/10 border-danger-500/20',
  warning: 'bg-warning-500/10 border-warning-500/20',
  info: 'bg-brand-500/10 border-brand-500/20',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] space-y-3 w-full max-w-sm pointer-events-none" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-lg shadow-float',
            bgMap[toast.type],
          ]"
          role="alert"
        >
          <span
            :class="[
              'flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold shrink-0',
              colorMap[toast.type],
            ]"
          >
            {{ iconMap[toast.type] }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-surface-900 dark:text-white">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-surface-600 dark:text-surface-400 mt-0.5">{{ toast.message }}</p>
          </div>
          <button
            class="shrink-0 p-0.5 rounded text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Dismiss notification"
            @click="removeToast(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%) scale(0.95); }
.toast-move { transition: transform 0.3s ease; }
</style>
