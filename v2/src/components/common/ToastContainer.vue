<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :message="toast.message"
          :duration="toast.duration"
          :closable="toast.closable"
          @close="remove(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import Toast from './Toast.vue';
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: var(--z-notification);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  pointer-events: none;
}

/* List transitions */
.toast-list-move {
  transition: transform var(--duration-base) var(--ease-in-out);
}
</style>
