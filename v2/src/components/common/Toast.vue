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
/* ═══════════════════════════════════════════════════════════
   CYBER TOAST - Terminal System Notification
   ═══════════════════════════════════════════════════════════ */

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface);
  border-radius: var(--radius-sm);
  border: 2px solid;
  border-left-width: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8),
              0 8px 32px rgba(0, 0, 0, 0.6);
  min-width: 320px;
  max-width: 500px;
  pointer-events: auto;
  position: relative;
  backdrop-filter: blur(10px);
}

/* Success - Neon Green */
.toast-success {
  border-color: var(--success);
  box-shadow: 0 0 20px var(--success-glow),
              0 0 40px rgba(57, 255, 20, 0.2),
              inset 0 0 15px rgba(57, 255, 20, 0.05),
              0 8px 32px rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    90deg,
    rgba(57, 255, 20, 0.08),
    var(--surface)
  );
}

.toast-success .toast-icon {
  color: var(--success);
  filter: drop-shadow(0 0 5px var(--success-glow));
  animation: successPulse 2s ease-in-out infinite;
}

@keyframes successPulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px var(--success-glow));
  }
  50% {
    filter: drop-shadow(0 0 10px var(--success-glow));
  }
}

/* Error - Critical Red */
.toast-error {
  border-color: var(--error);
  box-shadow: 0 0 20px var(--error-glow),
              0 0 40px rgba(255, 46, 99, 0.2),
              inset 0 0 15px rgba(255, 46, 99, 0.05),
              0 8px 32px rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    90deg,
    rgba(255, 46, 99, 0.08),
    var(--surface)
  );
}

.toast-error .toast-icon {
  color: var(--error);
  filter: drop-shadow(0 0 5px var(--error-glow));
  animation: errorPulse 1s ease-in-out infinite;
}

@keyframes errorPulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px var(--error-glow));
    opacity: 1;
  }
  50% {
    filter: drop-shadow(0 0 8px var(--error-glow));
    opacity: 0.8;
  }
}

/* Warning - Amber Alert */
.toast-warning {
  border-color: var(--warning);
  box-shadow: 0 0 20px var(--warning-glow),
              0 0 40px rgba(255, 184, 0, 0.2),
              inset 0 0 15px rgba(255, 184, 0, 0.05),
              0 8px 32px rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    90deg,
    rgba(255, 184, 0, 0.08),
    var(--surface)
  );
}

.toast-warning .toast-icon {
  color: var(--warning);
  filter: drop-shadow(0 0 5px var(--warning-glow));
}

/* Info - Electric Cyan */
.toast-info {
  border-color: var(--info);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.4),
              0 0 40px rgba(0, 217, 255, 0.2),
              inset 0 0 15px rgba(0, 217, 255, 0.05),
              0 8px 32px rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    90deg,
    rgba(0, 217, 255, 0.08),
    var(--surface)
  );
}

.toast-info .toast-icon {
  color: var(--info);
  filter: drop-shadow(0 0 5px rgba(0, 217, 255, 0.6));
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
  letter-spacing: 0.02em;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: var(--error);
  background: rgba(255, 46, 99, 0.1);
  border-color: var(--error);
  box-shadow: 0 0 8px var(--error-glow);
  transform: rotate(90deg);
}

/* Animations - Slide in from right with power-on effect */
.toast-enter-active {
  animation: toastSlideIn 400ms cubic-bezier(0.65, 0, 0.35, 1);
}

.toast-leave-active {
  animation: toastSlideOut 300ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes toastSlideIn {
  0% {
    transform: translateX(120%) scaleX(0.3);
    opacity: 0;
    filter: brightness(2);
  }
  60% {
    transform: translateX(-10px) scaleX(1.05);
    filter: brightness(1.2);
  }
  100% {
    transform: translateX(0) scaleX(1);
    opacity: 1;
    filter: brightness(1);
  }
}

@keyframes toastSlideOut {
  0% {
    transform: translateX(0) scaleY(1);
    opacity: 1;
  }
  100% {
    transform: translateX(120%) scaleY(0.8);
    opacity: 0;
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .toast {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1),
              0 8px 32px rgba(0, 0, 0, 0.15);
}

:root[data-theme='light'] .toast-success,
:root[data-theme='light'] .toast-error,
:root[data-theme='light'] .toast-warning,
:root[data-theme='light'] .toast-info {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15),
              0 8px 32px rgba(0, 0, 0, 0.2);
}
</style>
