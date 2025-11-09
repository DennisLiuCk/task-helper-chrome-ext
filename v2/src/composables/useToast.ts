import { ref } from 'vue';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  closable?: boolean;
}

const toasts = ref<ToastItem[]>([]);

export function useToast() {
  function show(
    type: ToastItem['type'],
    message: string,
    duration = 3000,
    closable = true
  ) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastItem = {
      id,
      type,
      message,
      duration,
      closable,
    };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  }

  function remove(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  function clear() {
    toasts.value = [];
  }

  return {
    toasts,
    success: (message: string, duration?: number) => show('success', message, duration),
    error: (message: string, duration?: number) => show('error', message, duration),
    warning: (message: string, duration?: number) => show('warning', message, duration),
    info: (message: string, duration?: number) => show('info', message, duration),
    remove,
    clear,
  };
}
