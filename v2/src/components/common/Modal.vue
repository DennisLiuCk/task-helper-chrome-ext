<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div
          :class="['modal-content', `modal-${size}`]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
          :aria-describedby="description ? 'modal-description' : undefined"
          @click.stop
        >
          <!-- Header -->
          <div v-if="title || showClose || $slots.header" class="modal-header">
            <slot name="header">
              <h2 v-if="title" id="modal-title" class="modal-title">
                {{ title }}
              </h2>
            </slot>

            <button
              v-if="showClose"
              class="modal-close"
              @click="handleClose"
              aria-label="關閉"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Description -->
          <p v-if="description" id="modal-description" class="modal-description">
            {{ description }}
          </p>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';

interface Props {
  show: boolean;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnOverlay: true,
  closeOnEsc: true,
  showClose: true,
});

const emit = defineEmits<{
  close: [];
  'update:show': [value: boolean];
}>();

function handleClose() {
  emit('close');
  emit('update:show', false);
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    handleClose();
  }
}

function handleEscape(event: KeyboardEvent) {
  if (props.show && props.closeOnEsc && event.key === 'Escape') {
    handleClose();
  }
}

// ESC key handler
watch(
  () => props.show,
  (show) => {
    if (show) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    }
  }
);

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-4);
}

.modal-content {
  background: var(--background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-height: 90vh;
  overflow: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 500px;
}

.modal-lg {
  max-width: 600px;
}

.modal-xl {
  max-width: 800px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition-all);
  flex-shrink: 0;
}

.modal-close:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.modal-description {
  padding: var(--spacing-4) var(--spacing-6) 0;
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  flex-shrink: 0;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-base) var(--ease-in-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modalSlideUp var(--duration-base) var(--ease-out);
}

.modal-leave-active .modal-content {
  animation: modalSlideDown var(--duration-base) var(--ease-in);
}

@keyframes modalSlideUp {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes modalSlideDown {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
}

/* Dark Mode */
:root[data-theme='dark'] .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
