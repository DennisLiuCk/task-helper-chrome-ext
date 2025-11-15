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
   MODERN BADGE - Clean Professional Status Indicators
   ═══════════════════════════════════════════════════════════ */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: all 0.2s var(--ease-out);
  border: 1px solid transparent;
}

/* Sizes */
.badge-sm {
  padding: 2px var(--spacing-2);
  font-size: 9px;
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

/* Default Variant */
.badge-default {
  background: var(--surface-variant);
  color: var(--text-secondary);
  border-color: var(--border);
}

/* Primary Variant */
.badge-primary {
  background: var(--primary-alpha-20);
  color: var(--primary-600);
  border-color: var(--primary-200);
}

/* Success Variant */
.badge-success {
  background: var(--success-bg);
  color: var(--success);
  border-color: var(--success-border);
}

/* Warning Variant */
.badge-warning {
  background: var(--warning-bg);
  color: var(--warning);
  border-color: var(--warning-border);
}

/* Error Variant */
.badge-error {
  background: var(--error-bg);
  color: var(--error);
  border-color: var(--error-border);
}

/* Info Variant */
.badge-info {
  background: var(--info-bg);
  color: var(--info);
  border-color: var(--info-border);
}

/* Status Variants */

/* NA */
.badge-na {
  background: var(--status-na-bg);
  color: var(--status-na);
  border-color: var(--status-na-border);
}

/* DEV */
.badge-dev {
  background: var(--status-dev-bg);
  color: var(--status-dev);
  border-color: var(--status-dev-border);
}

/* QA */
.badge-qa {
  background: var(--status-qa-bg);
  color: var(--status-qa);
  border-color: var(--status-qa-border);
}

/* UAT */
.badge-uat {
  background: var(--status-uat-bg);
  color: var(--status-uat);
  border-color: var(--status-uat-border);
}

/* DONE */
.badge-done {
  background: var(--status-done-bg);
  color: var(--status-done);
  border-color: var(--status-done-border);
}

/* BLOCKED */
.badge-blocked {
  background: var(--status-blocked-bg);
  color: var(--status-blocked);
  border-color: var(--status-blocked-border);
}

/* Dark mode adjustments */
:root[data-theme='dark'] .badge-default {
  background: var(--surface-variant);
  color: var(--text-secondary);
  border-color: var(--border);
}
</style>
