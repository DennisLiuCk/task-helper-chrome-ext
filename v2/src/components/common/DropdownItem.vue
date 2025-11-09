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
.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-colors);
  user-select: none;
}

.dropdown-item:hover:not(.dropdown-item-disabled) {
  background: var(--surface-hover);
}

.dropdown-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-item-danger {
  color: var(--error);
}

.dropdown-item-danger:hover:not(.dropdown-item-disabled) {
  background: var(--error-bg);
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-item-text {
  flex: 1;
}
</style>
