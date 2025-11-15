<template>
  <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'na'
    | 'dev'
    | 'qa'
    | 'uat'
    | 'done'
    | 'blocked';
  size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
});
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CYBER STATUS BADGE - Neon Terminal Status Indicators
   ═══════════════════════════════════════════════════════════ */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);  /* Less extreme than full, sharper */
  font-family: var(--font-mono);    /* Monospace for technical feel */
  font-weight: var(--font-bold);
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.08em;           /* Wide tracking for readability */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

/* Subtle pulse animation */
.badge::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(45deg, transparent, currentColor, transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.badge:hover::before {
  opacity: 0.5;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

/* Sizes */
.badge-sm {
  padding: 2px var(--spacing-2);
  font-size: 9px;              /* Smaller for density */
  height: 18px;
  min-width: 32px;
}

.badge-md {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: 10px;
  height: 22px;
  min-width: 40px;
}

.badge-lg {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: 11px;
  height: 26px;
  min-width: 48px;
}

/* Default Variant - Neutral Gray */
.badge-default {
  background: var(--surface-variant);
  color: var(--text-secondary);
  border-color: var(--border);
}

/* Primary Variant - Electric Cyan */
.badge-primary {
  background: var(--primary-alpha-20);
  color: var(--primary-400);
  border-color: var(--primary-500);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 217, 255, 0.1);
}

/* Success Variant - Neon Green */
.badge-success {
  background: var(--success-bg);
  color: var(--success);
  border-color: var(--success);
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.3),
              inset 0 0 10px rgba(57, 255, 20, 0.1);
  text-shadow: 0 0 5px rgba(57, 255, 20, 0.5);
}

/* Warning Variant - Amber Alert */
.badge-warning {
  background: var(--warning-bg);
  color: var(--warning);
  border-color: var(--warning);
  box-shadow: 0 0 10px rgba(255, 184, 0, 0.3),
              inset 0 0 10px rgba(255, 184, 0, 0.1);
  text-shadow: 0 0 5px rgba(255, 184, 0, 0.5);
}

/* Error Variant - Critical Red */
.badge-error {
  background: var(--error-bg);
  color: var(--error);
  border-color: var(--error);
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.3),
              inset 0 0 10px rgba(255, 46, 99, 0.1);
  text-shadow: 0 0 5px rgba(255, 46, 99, 0.5);
}

/* Info Variant - Cyber Blue */
.badge-info {
  background: var(--info-bg);
  color: var(--info);
  border-color: var(--info);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 217, 255, 0.1);
  text-shadow: 0 0 5px rgba(0, 217, 255, 0.5);
}

/* Status Variants - Terminal Status Codes */

/* NA - Gray Idle */
.badge-na {
  background: var(--status-na-bg);
  color: var(--status-na-hover);
  border-color: var(--status-na);
  box-shadow: inset 0 0 5px rgba(107, 114, 128, 0.2);
}

/* DEV - Amber Alert (In Progress) */
.badge-dev {
  background: var(--status-dev-bg);
  color: var(--status-dev);
  border-color: var(--status-dev);
  box-shadow: 0 0 10px var(--status-dev-glow),
              inset 0 0 10px rgba(255, 184, 0, 0.15);
  text-shadow: 0 0 8px rgba(255, 184, 0, 0.6);
  animation: amberPulse 2s ease-in-out infinite;
}

@keyframes amberPulse {
  0%, 100% {
    box-shadow: 0 0 10px var(--status-dev-glow),
                inset 0 0 10px rgba(255, 184, 0, 0.15);
  }
  50% {
    box-shadow: 0 0 20px var(--status-dev-glow),
                inset 0 0 15px rgba(255, 184, 0, 0.2);
  }
}

/* QA - Neon Green (Testing) */
.badge-qa {
  background: var(--status-qa-bg);
  color: var(--status-qa);
  border-color: var(--status-qa);
  box-shadow: 0 0 10px var(--status-qa-glow),
              inset 0 0 10px rgba(57, 255, 20, 0.15);
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
}

/* UAT - Cyber Purple (Staging) */
.badge-uat {
  background: var(--status-uat-bg);
  color: var(--status-uat);
  border-color: var(--status-uat);
  box-shadow: 0 0 10px var(--status-uat-glow),
              inset 0 0 10px rgba(181, 55, 242, 0.15);
  text-shadow: 0 0 8px rgba(181, 55, 242, 0.6);
}

/* DONE - Electric Cyan (Complete) */
.badge-done {
  background: var(--status-done-bg);
  color: var(--status-done);
  border-color: var(--status-done);
  box-shadow: 0 0 15px var(--status-done-glow),
              inset 0 0 15px rgba(0, 217, 255, 0.2);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

/* BLOCKED - Critical Red (Emergency) */
.badge-blocked {
  background: var(--status-blocked-bg);
  color: var(--status-blocked);
  border-color: var(--status-blocked);
  box-shadow: 0 0 10px var(--status-blocked-glow),
              inset 0 0 10px rgba(255, 46, 99, 0.15);
  text-shadow: 0 0 8px rgba(255, 46, 99, 0.6);
  animation: criticalFlash 1.5s ease-in-out infinite;
}

@keyframes criticalFlash {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Light Mode Adjustments (softer glows) */
:root[data-theme='light'] .badge-default {
  background: var(--gray-100);
  color: var(--gray-700);
  border-color: var(--gray-300);
}

:root[data-theme='light'] .badge-primary {
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.2),
              inset 0 0 8px rgba(0, 217, 255, 0.08);
}

:root[data-theme='light'] .badge-success,
:root[data-theme='light'] .badge-warning,
:root[data-theme='light'] .badge-error,
:root[data-theme='light'] .badge-info,
:root[data-theme='light'] .badge-dev,
:root[data-theme='light'] .badge-qa,
:root[data-theme='light'] .badge-uat,
:root[data-theme='light'] .badge-done,
:root[data-theme='light'] .badge-blocked {
  /* Reduce glow intensity in light mode */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1),
              inset 0 0 5px rgba(0, 0, 0, 0.05);
  text-shadow: none;
}
</style>
