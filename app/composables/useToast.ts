interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

export const useToast = () => {
  const show = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = nextId++
    toasts.value.push({ id, message, type, duration })
  }

  const success = (message: string, duration = 3000) => {
    show(message, 'success', duration)
  }

  const error = (message: string, duration = 4000) => {
    show(message, 'error', duration)
  }

  const warning = (message: string, duration = 3500) => {
    show(message, 'warning', duration)
  }

  const info = (message: string, duration = 3000) => {
    show(message, 'info', duration)
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
    remove,
  }
}
