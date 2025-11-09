<template>
  <div class="dashboard">
    <div class="header">
      <h1>Dashboard</h1>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">總任務數</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.byStatus.DEV }}</div>
        <div class="stat-label">開發中</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.byStatus.QA }}</div>
        <div class="stat-label">測試中</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.byStatus.DONE }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <div class="content">
      <p class="placeholder">Dashboard 內容建構中...</p>
      <div class="dev-links">
        <router-link to="/showcase" class="dev-link">
          查看組件展示頁面 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/tasks';

const taskStore = useTaskStore();

const stats = computed(() => taskStore.statistics);
</script>

<style scoped>
.dashboard {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  text-align: center;
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary-500);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
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
  margin-bottom: var(--spacing-4);
}

.dev-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
}

.dev-link {
  color: var(--primary-500);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  transition: var(--transition-colors);
}

.dev-link:hover {
  background: var(--primary-100);
  color: var(--primary-700);
}
</style>
