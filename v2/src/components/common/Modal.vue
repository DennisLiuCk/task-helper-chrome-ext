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
/* ═══════════════════════════════════════════════════════════
   CYBER MODAL - Terminal Window with Power-On Effect
   ═══════════════════════════════════════════════════════════ */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-4);

  /* Cyber grid overlay */
  background-image:
    linear-gradient(rgba(0, 217, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.02) 1px, transparent 1px);
  background-size: 30px 30px;
  background-color: rgba(0, 0, 0, 0.85);
}

.modal-content {
  background: var(--surface);
  border-radius: var(--radius-md);
  border: 2px solid var(--primary-500);
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.5),
              0 0 60px rgba(0, 217, 255, 0.3),
              inset 0 0 20px rgba(0, 217, 255, 0.05),
              0 20px 60px rgba(0, 0, 0, 0.8);
  max-height: 90vh;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Corner accents - cyberpunk style */
.modal-content::before,
.modal-content::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-500);
  z-index: 1;
}

.modal-content::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
  box-shadow: -2px -2px 10px rgba(0, 217, 255, 0.5);
}

.modal-content::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
  box-shadow: 2px 2px 10px rgba(0, 217, 255, 0.5);
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
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 2px solid rgba(0, 217, 255, 0.3);
  background: linear-gradient(
    180deg,
    rgba(0, 217, 255, 0.08),
    transparent
  );
  flex-shrink: 0;
  position: relative;
}

.modal-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-500),
    transparent
  );
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

.modal-title {
  margin: 0;
  font-size: var(--text-xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--primary-400);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(0, 217, 255, 0.3);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgba(255, 46, 99, 0.2);
  border-color: var(--error);
  color: var(--error);
  box-shadow: 0 0 15px var(--error-glow);
  transform: rotate(90deg);
}

.modal-description {
  padding: var(--spacing-4) var(--spacing-6) 0;
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  line-height: 1.6;
  flex-shrink: 0;
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
}

/* Custom scrollbar for modal body */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.4);
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--primary-500), var(--primary-700));
  border-radius: 0;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 2px solid rgba(0, 217, 255, 0.2);
  background: linear-gradient(
    0deg,
    rgba(0, 217, 255, 0.05),
    transparent
  );
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  flex-shrink: 0;
  position: relative;
}

.modal-footer::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-500),
    transparent
  );
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
}

/* Animations - Power-On CRT Effect */
.modal-enter-active {
  transition: opacity 300ms var(--ease-in-out);
}

.modal-leave-active {
  transition: opacity 200ms var(--ease-in);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Power-On Animation - CRT Screen Boot */
.modal-enter-active .modal-content {
  animation: powerOnCRT 500ms cubic-bezier(0.65, 0, 0.35, 1);
}

.modal-leave-active .modal-content {
  animation: powerOffCRT 300ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes powerOnCRT {
  0% {
    transform: scaleY(0.002) scaleX(0);
    opacity: 0;
    filter: brightness(3);
  }
  30% {
    transform: scaleY(0.002) scaleX(1);
    opacity: 1;
  }
  50% {
    transform: scaleY(0.5) scaleX(1);
    filter: brightness(1.5);
  }
  100% {
    transform: scaleY(1) scaleX(1);
    opacity: 1;
    filter: brightness(1);
  }
}

@keyframes powerOffCRT {
  0% {
    transform: scaleY(1) scaleX(1);
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    transform: scaleY(0.01) scaleX(1);
    opacity: 1;
    filter: brightness(2);
  }
  100% {
    transform: scaleY(0) scaleX(0.1);
    opacity: 0;
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .modal-overlay {
  background: rgba(249, 250, 251, 0.95);
  backdrop-filter: blur(10px);
}

:root[data-theme='light'] .modal-content {
  background: var(--surface);
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.3),
              0 20px 60px rgba(0, 0, 0, 0.2);
}
</style>
