<template>
  <div class="releases">
    <div class="header">
      <h1>發布看板</h1>
    </div>
    <div class="content">
      <p class="placeholder">發布看板建構中...</p>
    </div>
  </div>
</template>

<style scoped>
.releases {
  padding: var(--spacing-4);
}
.header {
  margin-bottom: var(--spacing-6);
}
.header h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
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
}
</style>
