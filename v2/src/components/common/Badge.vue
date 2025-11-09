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
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
  line-height: 1;
  white-space: nowrap;
  transition: var(--transition-colors);
}

/* Sizes */
.badge-sm {
  padding: 2px var(--spacing-2);
  font-size: var(--text-xs);
  height: 18px;
}

.badge-md {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--text-xs);
  height: 20px;
}

.badge-lg {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-sm);
  height: 24px;
}

/* Default Variant */
.badge-default {
  background: var(--gray-100);
  color: var(--gray-700);
}

/* Primary Variant */
.badge-primary {
  background: var(--primary-100);
  color: var(--primary-700);
}

/* Success Variant */
.badge-success {
  background: var(--success-bg);
  color: var(--success);
}

/* Warning Variant */
.badge-warning {
  background: var(--warning-bg);
  color: var(--warning);
}

/* Error Variant */
.badge-error {
  background: var(--error-bg);
  color: var(--error);
}

/* Info Variant */
.badge-info {
  background: var(--info-bg);
  color: var(--info);
}

/* Status Variants */
.badge-na {
  background: var(--status-na-bg);
  color: var(--status-na);
}

.badge-dev {
  background: var(--status-dev-bg);
  color: var(--status-dev);
}

.badge-qa {
  background: var(--status-qa-bg);
  color: var(--status-qa);
}

.badge-uat {
  background: var(--status-uat-bg);
  color: var(--status-uat);
}

.badge-done {
  background: var(--status-done-bg);
  color: var(--status-done);
}

.badge-blocked {
  background: var(--status-blocked-bg);
  color: var(--status-blocked);
}

/* Dark Mode Adjustments */
:root[data-theme='dark'] .badge-default {
  background: var(--gray-700);
  color: var(--gray-200);
}

:root[data-theme='dark'] .badge-primary {
  background: rgba(66, 165, 245, 0.2);
  color: var(--primary-300);
}
</style>
