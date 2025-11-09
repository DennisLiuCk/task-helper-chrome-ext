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
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: var(--transition-all);
  border: 1px solid transparent;
  position: relative;
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
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
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  background: var(--primary-700);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

/* Secondary Variant */
.btn-secondary {
  background: transparent;
  color: var(--primary-500);
  border-color: var(--primary-500);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--primary-50);
  border-color: var(--primary-600);
  color: var(--primary-600);
}

.btn-secondary:active:not(:disabled) {
  background: var(--primary-100);
}

/* Tertiary Variant */
.btn-tertiary {
  background: var(--surface-variant);
  color: var(--text-primary);
  border-color: var(--border);
}

.btn-tertiary:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: var(--border-strong);
}

.btn-tertiary:active:not(:disabled) {
  background: var(--border);
}

/* Ghost Variant */
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--surface-hover);
}

.btn-ghost:active:not(:disabled) {
  background: var(--surface-variant);
}

/* Danger Variant */
.btn-danger {
  background: var(--error);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-danger:hover:not(:disabled) {
  background: var(--error-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-danger:active:not(:disabled) {
  background: var(--error-hover);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

/* States */
.btn-disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
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

/* Dark Mode Adjustments */
:root[data-theme='dark'] .btn-secondary {
  color: var(--primary-400);
  border-color: var(--primary-400);
}

:root[data-theme='dark'] .btn-secondary:hover:not(:disabled) {
  background: rgba(66, 165, 245, 0.1);
  border-color: var(--primary-300);
  color: var(--primary-300);
}
</style>
