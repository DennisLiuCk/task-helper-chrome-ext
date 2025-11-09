<template>
  <div class="tasks">
    <div class="header">
      <h1>任務管理</h1>
    </div>

    <div class="content">
      <p class="placeholder">任務列表建構中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Task management will be implemented here
</script>

<style scoped>
.tasks {
  padding: var(--spacing-4);
}

.header {
  margin-bottom: var(--spacing-6);
}

.header h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}

.placeholder {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-base);
}
</style>
