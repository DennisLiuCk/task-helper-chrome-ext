<template>
  <div class="dashboard">
    <div class="header">
      <h1>儀表板</h1>
      <div class="header-actions">
        <Button variant="primary" size="md" @click="navigateToNewTask">
          ➕ 新增任務
        </Button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" @click="filterByStatus(null)">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">總任務數</div>
      </div>

      <div class="stat-card clickable" @click="filterByStatus('DEV')">
        <div class="stat-value" style="color: var(--status-dev)">{{ stats.byStatus.DEV }}</div>
        <div class="stat-label">開發中</div>
      </div>

      <div class="stat-card clickable" @click="filterByStatus('QA')">
        <div class="stat-value" style="color: var(--status-qa)">{{ stats.byStatus.QA }}</div>
        <div class="stat-label">測試中</div>
      </div>

      <div class="stat-card clickable" @click="filterByStatus('DONE')">
        <div class="stat-value" style="color: var(--status-done)">{{ stats.byStatus.DONE }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="quick-stat-item">
        <span class="quick-stat-icon">📌</span>
        <span class="quick-stat-text">
          <strong>{{ pinnedTasksCount }}</strong> 個置頂任務
        </span>
      </div>
      <div class="quick-stat-item">
        <span class="quick-stat-icon">⭐</span>
        <span class="quick-stat-text">
          <strong>{{ starredTasksCount }}</strong> 個星標任務
        </span>
      </div>
      <div class="quick-stat-item">
        <span class="quick-stat-icon">⚠️</span>
        <span class="quick-stat-text">
          <strong>{{ stats.byStatus.BLOCKED }}</strong> 個阻塞任務
        </span>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">最近任務</h2>
        <router-link to="/tasks" class="view-all-link">
          查看全部 →
        </router-link>
      </div>

      <div v-if="recentTasks.length > 0" class="recent-tasks">
        <div
          v-for="task in recentTasks"
          :key="task.id"
          class="task-item"
          @click="navigateToTask(task)"
        >
          <div class="task-item__header">
            <div class="task-item__id">
              <Badge :variant="getStatusVariant(task.status)" size="sm">
                {{ task.status }}
              </Badge>
              <span class="task-id">{{ task.id }}</span>
            </div>
            <div class="task-item__icons">
              <span v-if="task.isPinned">📌</span>
              <span v-if="task.isStarred">⭐</span>
            </div>
          </div>
          <div class="task-item__title">{{ task.title || '無標題' }}</div>
          <div class="task-item__meta">
            <span class="task-meta-item">{{ task.service }}</span>
            <span v-if="task.priority" class="task-meta-item">
              {{ getPriorityLabel(task.priority) }}
            </span>
            <span class="task-meta-item">
              {{ formatDate(task.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>還沒有任務</p>
        <Button variant="primary" size="sm" @click="navigateToNewTask">
          創建第一個任務
        </Button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2 class="section-title">快速操作</h2>
      <div class="quick-actions">
        <button class="quick-action-card" @click="navigateToNewTask">
          <span class="quick-action-icon">➕</span>
          <span class="quick-action-label">新增任務</span>
        </button>

        <router-link to="/tasks" class="quick-action-card">
          <span class="quick-action-icon">✅</span>
          <span class="quick-action-label">任務列表</span>
        </router-link>

        <router-link to="/releases" class="quick-action-card">
          <span class="quick-action-icon">🚀</span>
          <span class="quick-action-label">發布看板</span>
        </router-link>

        <router-link to="/links" class="quick-action-card">
          <span class="quick-action-icon">🔗</span>
          <span class="quick-action-label">常用連結</span>
        </router-link>

        <router-link to="/settings" class="quick-action-card">
          <span class="quick-action-icon">⚙️</span>
          <span class="quick-action-label">設定</span>
        </router-link>

        <router-link to="/showcase" class="quick-action-card">
          <span class="quick-action-icon">🎨</span>
          <span class="quick-action-label">組件展示</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/tasks';
import type { Task, TaskStatus } from '@/types';
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';

const router = useRouter();
const taskStore = useTaskStore();

const stats = computed(() => taskStore.statistics);
const recentTasks = computed(() => taskStore.recentTasks.slice(0, 5));
const pinnedTasksCount = computed(() => taskStore.pinnedTasks.length);
const starredTasksCount = computed(() => taskStore.allTasks.filter(t => t.isStarred).length);

onMounted(async () => {
  await taskStore.loadTasks();
});

function navigateToNewTask() {
  router.push('/tasks');
  // Note: The Tasks page will handle showing the create modal
}

function navigateToTask(task: Task) {
  router.push('/tasks');
}

function filterByStatus(status: TaskStatus | null) {
  router.push('/tasks');
}

function getStatusVariant(status: TaskStatus): string {
  const variantMap: Record<TaskStatus, string> = {
    NA: 'na',
    DEV: 'dev',
    QA: 'qa',
    UAT: 'uat',
    DONE: 'done',
    BLOCKED: 'blocked',
  };
  return variantMap[status] || 'na';
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高',
    CRITICAL: '緊急',
  };
  return labels[priority] || priority;
}

function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '剛剛';
  if (minutes < 60) return `${minutes} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  if (days < 7) return `${days} 天前`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-TW');
}
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.header h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  text-align: center;
  transition: var(--transition-colors);
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  border-color: var(--primary-400);
  box-shadow: var(--shadow-sm);
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

/* Quick Stats */
.quick-stats {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
}

.quick-stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.quick-stat-icon {
  font-size: var(--text-lg);
}

.quick-stat-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.quick-stat-text strong {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

/* Section */
.section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.view-all-link {
  font-size: var(--text-sm);
  color: var(--primary-500);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: var(--transition-colors);
}

.view-all-link:hover {
  color: var(--primary-700);
}

/* Recent Tasks */
.recent-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.task-item {
  padding: var(--spacing-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-colors);
}

.task-item:hover {
  border-color: var(--primary-400);
  background: var(--background);
}

.task-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.task-item__id {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.task-id {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.task-item__icons {
  display: flex;
  gap: var(--spacing-1);
}

.task-item__title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.task-item__meta {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.task-meta-item {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
}

.empty-state p {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-4) 0;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-3);
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-colors);
}

.quick-action-card:hover {
  border-color: var(--primary-400);
  background: var(--surface);
}

.quick-action-icon {
  font-size: var(--text-2xl);
}

.quick-action-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-align: center;
}
</style>
