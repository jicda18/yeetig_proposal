import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

function addToast(type: Toast['type'], title: string, message?: string, duration = 4000) {
  const id = nextId++
  toasts.value.push({ id, type, title, message, duration })
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
  return id
}

function removeToast(id: number) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) toasts.value.splice(index, 1)
}

export function useToast() {
  return {
    toasts,
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
    warning: (title: string, message?: string) => addToast('warning', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
    dismiss: removeToast,
  }
}
