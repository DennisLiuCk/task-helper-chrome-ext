<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-disabled': disabled,
        'btn-loading': loading,
        'btn-full': fullWidth,
      },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle
          class="spinner-circle"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke-width="3"
        />
      </svg>
    </span>

    <component
      v-if="icon && iconPosition === 'left' && !loading"
      :is="icon"
      class="btn-icon btn-icon-left"
    />

    <span class="btn-content">
      <slot />
    </span>

    <component
      v-if="icon && iconPosition === 'right' && !loading"
      :is="icon"
      class="btn-icon btn-icon-right"
    />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: Component;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   MODERN BUTTON - Clean Professional Controls
   ═══════════════════════════════════════════════════════════ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s var(--ease-out);
  border: 1px solid transparent;
  position: relative;
}

.btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* Sizes */
.btn-xs {
  height: 24px;
  padding: 0 var(--spacing-2);
  font-size: var(--text-xs);
  gap: var(--spacing-1);
}

.btn-sm {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--text-sm);
}

.btn-md {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--text-base);
}

.btn-lg {
  height: 48px;
  padding: 0 var(--spacing-6);
  font-size: var(--text-lg);
}

/* Primary Variant */
.btn-primary {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
  border-color: var(--primary-600);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  background: var(--primary-700);
  border-color: var(--primary-700);
  box-shadow: var(--shadow-sm);
}

/* Secondary Variant */
.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: var(--border-strong);
}

.btn-secondary:active:not(:disabled) {
  background: var(--surface-variant);
}

/* Tertiary Variant */
.btn-tertiary {
  background: var(--surface-variant);
  color: var(--text-secondary);
  border-color: var(--border);
}

.btn-tertiary:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.btn-tertiary:active:not(:disabled) {
  background: var(--surface);
}

/* Ghost Variant */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.btn-ghost:active:not(:disabled) {
  background: var(--surface-variant);
}

/* Danger Variant */
.btn-danger {
  background: var(--error);
  color: white;
  border-color: var(--error);
  box-shadow: var(--shadow-sm);
}

.btn-danger:hover:not(:disabled) {
  background: var(--error-hover);
  border-color: var(--error-hover);
  box-shadow: var(--shadow-md);
}

.btn-danger:active:not(:disabled) {
  background: var(--error);
  box-shadow: var(--shadow-sm);
}

/* States */
.btn-disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  position: relative;
  cursor: not-allowed;
}

.btn-loading .btn-content {
  visibility: hidden;
}

.btn-loading .btn-icon {
  visibility: hidden;
}

.btn-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: spin 0.8s linear infinite;
  width: 16px;
  height: 16px;
}

.btn-sm .spinner {
  width: 14px;
  height: 14px;
}

.btn-xs .spinner {
  width: 12px;
  height: 12px;
}

.btn-lg .spinner {
  width: 20px;
  height: 20px;
}

.spinner-circle {
  stroke: currentColor;
  stroke-linecap: round;
  stroke-dasharray: 50;
  stroke-dashoffset: 25;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Full Width */
.btn-full {
  width: 100%;
}

/* Icons */
.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-xs .btn-icon {
  width: 12px;
  height: 12px;
}

.btn-sm .btn-icon {
  width: 14px;
  height: 14px;
}

.btn-lg .btn-icon {
  width: 20px;
  height: 20px;
}

/* Dark mode adjustments */
:root[data-theme='dark'] .btn-secondary {
  background: var(--surface);
  border-color: var(--border);
}

:root[data-theme='dark'] .btn-tertiary {
  background: var(--surface-variant);
}
</style>
