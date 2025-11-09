<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', `toast-${type}`]">
      <div class="toast-icon">
        <svg
          v-if="type === 'success'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>

        <svg
          v-else-if="type === 'error'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>

        <svg
          v-else-if="type === 'warning'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>

        <svg
          v-else
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>

      <div class="toast-message">{{ message }}</div>

      <button v-if="closable" class="toast-close" @click="close" aria-label="關閉">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  closable: true,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);

onMounted(() => {
  visible.value = true;

  if (props.duration > 0) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});

function close() {
  visible.value = false;
  setTimeout(() => {
    emit('close');
  }, 200);
}
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 500px;
  border-left: 4px solid;
  pointer-events: auto;
}

.toast-success {
  border-left-color: var(--success);
}

.toast-success .toast-icon {
  color: var(--success);
}

.toast-error {
  border-left-color: var(--error);
}

.toast-error .toast-icon {
  color: var(--error);
}

.toast-warning {
  border-left-color: var(--warning);
}

.toast-warning .toast-icon {
  color: var(--warning);
}

.toast-info {
  border-left-color: var(--info);
}

.toast-info .toast-icon {
  color: var(--info);
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-primary);
  line-height: var(--leading-normal);
}

.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-in-out);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.toast-close:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}

/* Animations */
.toast-enter-active {
  animation: toastIn var(--duration-base) var(--ease-bounce);
}

.toast-leave-active {
  animation: toastOut var(--duration-base) var(--ease-in);
}

@keyframes toastIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toastOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
