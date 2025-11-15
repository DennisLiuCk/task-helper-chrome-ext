<template>
  <div ref="dropdownRef" class="dropdown">
    <div class="dropdown-trigger" @click="toggle">
      <slot name="trigger">
        <button class="dropdown-button">
          <span>{{ label }}</span>
          <svg
            class="dropdown-arrow"
            :class="{ 'dropdown-arrow-open': isOpen }"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </slot>
    </div>

    <Transition name="dropdown">
      <div v-if="isOpen" :class="['dropdown-menu', `dropdown-${placement}`]">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  label?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

withDefaults(defineProps<Props>(), {
  label: 'Dropdown',
  placement: 'bottom-start',
});

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    emit('open');
  } else {
    emit('close');
  }
}

function close() {
  isOpen.value = false;
  emit('close');
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineExpose({
  close,
  toggle,
  isOpen,
});
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CYBER DROPDOWN - Terminal Command Menu
   ═══════════════════════════════════════════════════════════ */

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

/* Scan line hover effect */
.dropdown-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.15),
    transparent
  );
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.dropdown-button:hover::before {
  left: 100%;
}

.dropdown-button:hover {
  background: rgba(0, 217, 255, 0.08);
  border-color: var(--primary-500);
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.3),
              inset 0 0 15px rgba(0, 0, 0, 0.5);
  color: var(--primary-400);
}

.dropdown-arrow {
  color: var(--primary-500);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 3px rgba(0, 217, 255, 0.5));
}

.dropdown-arrow-open {
  transform: rotate(180deg);
  filter: drop-shadow(0 0 5px rgba(0, 217, 255, 0.8));
}

.dropdown-menu {
  position: absolute;
  z-index: var(--z-dropdown);
  min-width: 180px;
  margin-top: var(--spacing-2);
  padding: var(--spacing-2);
  background: var(--surface);
  border: 2px solid var(--primary-500);
  border-radius: var(--radius-sm);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.4),
              0 0 40px rgba(0, 217, 255, 0.2),
              inset 0 0 15px rgba(0, 217, 255, 0.05),
              0 8px 32px rgba(0, 0, 0, 0.6);
}

/* Corner accent borders */
.dropdown-menu::before,
.dropdown-menu::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--primary-500);
  z-index: 1;
}

.dropdown-menu::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
  box-shadow: -2px -2px 8px rgba(0, 217, 255, 0.5);
}

.dropdown-menu::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
  box-shadow: 2px 2px 8px rgba(0, 217, 255, 0.5);
}

/* Placement */
.dropdown-bottom-start {
  top: 100%;
  left: 0;
}

.dropdown-bottom-end {
  top: 100%;
  right: 0;
}

.dropdown-top-start {
  bottom: 100%;
  left: 0;
  margin-top: 0;
  margin-bottom: var(--spacing-2);
}

.dropdown-top-end {
  bottom: 100%;
  right: 0;
  margin-top: 0;
  margin-bottom: var(--spacing-2);
}

/* Animation - Power-On Effect */
.dropdown-enter-active {
  animation: dropdownPowerOn 300ms cubic-bezier(0.65, 0, 0.35, 1);
}

.dropdown-leave-active {
  animation: dropdownPowerOff 200ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes dropdownPowerOn {
  0% {
    opacity: 0;
    transform: scaleY(0.3) translateY(-10px);
    filter: brightness(2);
  }
  60% {
    transform: scaleY(1.05) translateY(0);
    filter: brightness(1.2);
  }
  100% {
    opacity: 1;
    transform: scaleY(1) translateY(0);
    filter: brightness(1);
  }
}

@keyframes dropdownPowerOff {
  0% {
    opacity: 1;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform: scaleY(0.1);
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .dropdown-button {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .dropdown-button:hover {
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.25),
              inset 0 0 10px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .dropdown-menu {
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.2);
}
</style>
