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
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition-all);
}

.dropdown-button:hover {
  background: var(--surface-hover);
  border-color: var(--border-strong);
}

.dropdown-arrow {
  transition: transform var(--duration-base) var(--ease-in-out);
}

.dropdown-arrow-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  z-index: var(--z-dropdown);
  min-width: 160px;
  margin-top: var(--spacing-1);
  padding: var(--spacing-2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
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
  margin-bottom: var(--spacing-1);
}

.dropdown-top-end {
  bottom: 100%;
  right: 0;
  margin-top: 0;
  margin-bottom: var(--spacing-1);
}

/* Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--duration-fast) var(--ease-out);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
