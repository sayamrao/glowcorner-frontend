import { ref } from 'vue'
import { uid } from '~/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])

function addToast(toast: Omit<Toast, 'id'>) {
  const id = uid()
  const newToast: Toast = { ...toast, id, duration: toast.duration ?? 4000 }
  toasts.value.push(newToast)

  if (newToast.duration > 0) {
    setTimeout(() => removeToast(id), newToast.duration)
  }
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export function useToast() {
  return {
    toasts,
    removeToast,
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
  }
}
