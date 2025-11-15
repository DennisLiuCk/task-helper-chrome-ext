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
   CYBER COMMAND BUTTON - Neon-edged Terminal Controls
   ═══════════════════════════════════════════════════════════ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-sm);  /* Sharper corners */
  font-family: var(--font-mono);    /* Monospace for technical feel */
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;           /* Wider letter spacing */
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;    /* Thicker border for neon effect */
  position: relative;
  overflow: hidden;
}

/* Cyber scan line effect on hover */
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
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

/* Primary Variant - Neon Cyan Glow */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: var(--background);
  border-color: var(--primary-500);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              0 4px 8px rgba(0, 0, 0, 0.4);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  border-color: var(--primary-400);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.6),
              0 0 30px rgba(0, 217, 255, 0.4),
              0 6px 12px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-700), var(--primary-600));
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.4),
              0 2px 4px rgba(0, 0, 0, 0.6);
  transform: translateY(0);
}

/* Secondary Variant - Outlined Neon */
.btn-secondary {
  background: var(--surface);
  color: var(--primary-500);
  border-color: var(--primary-500);
  box-shadow: inset 0 0 10px rgba(0, 217, 255, 0.1);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--primary-alpha-10);
  border-color: var(--primary-400);
  color: var(--primary-400);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4),
              inset 0 0 20px rgba(0, 217, 255, 0.2);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
}

.btn-secondary:active:not(:disabled) {
  background: var(--primary-alpha-20);
  box-shadow: inset 0 0 10px rgba(0, 217, 255, 0.3);
}

/* Tertiary Variant - Muted Surface */
.btn-tertiary {
  background: var(--surface-variant);
  color: var(--text-secondary);
  border-color: var(--border);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.btn-tertiary:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: var(--border-strong);
  color: var(--text-primary);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2),
              inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.btn-tertiary:active:not(:disabled) {
  background: var(--surface);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
}

/* Ghost Variant - Minimal Glow on Hover */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(0, 217, 255, 0.05);
  border-color: rgba(0, 217, 255, 0.2);
  color: var(--text-primary);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
}

.btn-ghost:active:not(:disabled) {
  background: rgba(0, 217, 255, 0.1);
  box-shadow: inset 0 0 10px rgba(0, 217, 255, 0.2);
}

/* Danger Variant - Critical Red Alert */
.btn-danger {
  background: linear-gradient(135deg, #FF5282, var(--error));
  color: white;
  border-color: var(--error);
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.4),
              0 4px 8px rgba(0, 0, 0, 0.4);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--error), #D91E50);
  border-color: var(--error-hover);
  box-shadow: 0 0 20px rgba(255, 46, 99, 0.6),
              0 0 30px rgba(255, 46, 99, 0.4),
              0 6px 12px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}

.btn-danger:active:not(:disabled) {
  background: linear-gradient(135deg, #D91E50, #C01A45);
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.4),
              0 2px 4px rgba(0, 0, 0, 0.6);
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

/* Light Mode Adjustments (if needed) */
:root[data-theme='light'] .btn-primary {
  color: white;  /* Ensure text is readable on light backgrounds */
}

:root[data-theme='light'] .btn-secondary {
  background: white;
}

:root[data-theme='light'] .btn-ghost:hover:not(:disabled) {
  background: rgba(0, 217, 255, 0.08);
}
</style>
