<template>
  <div
    :class="[
      'dropdown-item',
      {
        'dropdown-item-disabled': disabled,
        'dropdown-item-danger': variant === 'danger',
      },
    ]"
    @click="handleClick"
  >
    <component v-if="icon" :is="icon" class="dropdown-item-icon" />
    <span class="dropdown-item-text">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  disabled?: boolean;
  variant?: 'default' | 'danger';
  icon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'default',
});

const emit = defineEmits<{
  click: [];
}>();

function handleClick() {
  if (!props.disabled) {
    emit('click');
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CYBER DROPDOWN ITEM - Terminal Command Option
   ═══════════════════════════════════════════════════════════ */

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-xs);
  border: 1px solid transparent;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
}

/* Scan line hover effect */
.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.2),
    transparent
  );
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.dropdown-item:hover:not(.dropdown-item-disabled)::before {
  left: 100%;
}

.dropdown-item:hover:not(.dropdown-item-disabled) {
  background: rgba(0, 217, 255, 0.1);
  border-color: rgba(0, 217, 255, 0.3);
  color: var(--primary-400);
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.2);
  transform: translateX(2px);
}

/* Command prompt indicator */
.dropdown-item::after {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--primary-500);
  opacity: 0;
  transition: all 0.2s;
  font-weight: var(--font-bold);
}

.dropdown-item:hover:not(.dropdown-item-disabled)::after {
  opacity: 1;
  left: var(--spacing-1);
}

.dropdown-item:hover:not(.dropdown-item-disabled) .dropdown-item-text {
  margin-left: var(--spacing-3);
}

.dropdown-item-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.2);
}

.dropdown-item-disabled::before,
.dropdown-item-disabled::after {
  display: none;
}

/* Danger variant - Critical action */
.dropdown-item-danger {
  color: var(--error);
}

.dropdown-item-danger::after {
  content: '!';
  color: var(--error);
}

.dropdown-item-danger:hover:not(.dropdown-item-disabled) {
  background: rgba(255, 46, 99, 0.15);
  border-color: var(--error);
  box-shadow: 0 0 10px var(--error-glow);
}

.dropdown-item-danger:hover:not(.dropdown-item-disabled)::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 46, 99, 0.2),
    transparent
  );
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--primary-400);
  filter: drop-shadow(0 0 2px rgba(0, 217, 255, 0.4));
  transition: all 0.2s;
  position: relative;
  z-index: 1;
}

.dropdown-item-danger .dropdown-item-icon {
  color: var(--error);
  filter: drop-shadow(0 0 2px var(--error-glow));
}

.dropdown-item:hover:not(.dropdown-item-disabled) .dropdown-item-icon {
  filter: drop-shadow(0 0 4px rgba(0, 217, 255, 0.8));
  transform: scale(1.1);
}

.dropdown-item-danger:hover:not(.dropdown-item-disabled) .dropdown-item-icon {
  filter: drop-shadow(0 0 4px var(--error-glow));
}

.dropdown-item-text {
  flex: 1;
  transition: margin 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

/* Light Mode Adjustments */
:root[data-theme='light'] .dropdown-item:hover:not(.dropdown-item-disabled) {
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.15);
}

:root[data-theme='light'] .dropdown-item-danger:hover:not(.dropdown-item-disabled) {
  background: rgba(255, 46, 99, 0.1);
  box-shadow: 0 0 8px rgba(255, 46, 99, 0.2);
}
</style>
