<template>
  <div class="dashboard">
    <div class="header">
      <h1>儀表板</h1>
      <div class="header-actions">
        <Button variant="primary" size="md" @click="navigateToNewTask">
          <Icon name="plus" size="sm" />
          新增任務
        </Button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" @click="filterByStatus(null)">
        <div class="stat-icon">
          <Icon name="tasks" size="md" />
        </div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">總任務數</div>
      </div>

      <div class="stat-card clickable" @click="filterByStatus('DEV')">
        <div class="stat-icon" style="color: var(--status-dev)">
          <Icon name="clock" size="md" />
        </div>
        <div class="stat-value" style="color: var(--status-dev)">{{ stats.byStatus.DEV }}</div>
        <div class="stat-label">開發中</div>
      </div>

      <div class="stat-card clickable" @click="filterByStatus('QA')">
        <div class="stat-icon" style="color: var(--status-qa)">
          <Icon name="check" size="md" />
        </div>
        <div class="stat-value" style="color: var(--status-qa)">{{ stats.byStatus.QA }}</div>
        <div class="stat-label">測試中</div>
      </div>

      <div class="stat-card clickable" @click="filterByStatus('DONE')">
        <div class="stat-icon" style="color: var(--status-done)">
          <Icon name="check" size="md" />
        </div>
        <div class="stat-value" style="color: var(--status-done)">{{ stats.byStatus.DONE }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="quick-stat-item">
        <Icon name="pin" size="sm" class="quick-stat-icon" />
        <span class="quick-stat-text">
          <strong>{{ pinnedTasksCount }}</strong> 個置頂任務
        </span>
      </div>
      <div class="quick-stat-item">
        <Icon name="star" size="sm" class="quick-stat-icon" />
        <span class="quick-stat-text">
          <strong>{{ starredTasksCount }}</strong> 個星標任務
        </span>
      </div>
      <div class="quick-stat-item">
        <Icon name="info" size="sm" class="quick-stat-icon" />
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
          查看全部
          <Icon name="chevronRight" size="xs" />
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
              <Icon v-if="task.isPinned" name="pin" size="xs" />
              <Icon v-if="task.isStarred" name="star" size="xs" />
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
          <Icon name="plus" size="lg" class="quick-action-icon" />
          <span class="quick-action-label">新增任務</span>
        </button>

        <router-link to="/tasks" class="quick-action-card">
          <Icon name="tasks" size="lg" class="quick-action-icon" />
          <span class="quick-action-label">任務列表</span>
        </router-link>

        <router-link to="/releases" class="quick-action-card">
          <Icon name="release" size="lg" class="quick-action-icon" />
          <span class="quick-action-label">發布看板</span>
        </router-link>

        <router-link to="/links" class="quick-action-card">
          <Icon name="link" size="lg" class="quick-action-icon" />
          <span class="quick-action-label">常用連結</span>
        </router-link>

        <router-link to="/settings" class="quick-action-card">
          <Icon name="settings" size="lg" class="quick-action-icon" />
          <span class="quick-action-label">設定</span>
        </router-link>

        <router-link to="/showcase" class="quick-action-card">
          <Icon name="grid" size="lg" class="quick-action-icon" />
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
import Icon from '@/components/common/Icon.vue';

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
/* ═══════════════════════════════════════════════════════════
   MODERN DASHBOARD - Clean Professional Interface
   ═══════════════════════════════════════════════════════════ */

.dashboard {
  padding: var(--spacing-6) var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.header h1 {
  font-size: var(--text-3xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Stats Grid - Modern Data Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
  transition: all 0.2s var(--ease-out);
  box-shadow: var(--shadow-sm);
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  margin-bottom: var(--spacing-2);
  color: var(--text-secondary);
}

.stat-value {
  font-size: var(--text-4xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-1);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  color: var(--text-secondary);
}

/* Quick Stats */
.quick-stats {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
}

.quick-stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--surface-variant);
  border-radius: var(--radius-full);
}

.quick-stat-icon {
  color: var(--text-secondary);
}

.quick-stat-text {
  font-size: var(--text-sm);
  font-family: var(--font-sans);
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
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: var(--text-lg);
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  color: var(--primary-600);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: all 0.2s var(--ease-out);
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
  padding: var(--spacing-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  background: var(--surface);
}

.task-item:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
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
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.task-item__icons {
  display: flex;
  gap: var(--spacing-2);
  color: var(--text-secondary);
}

.task-item__title {
  font-size: var(--text-base);
  font-family: var(--font-sans);
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
  font-family: var(--font-sans);
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
}

.empty-state p {
  font-size: var(--text-base);
  font-family: var(--font-sans);
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
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  background: var(--surface-variant);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.quick-action-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
  background: var(--surface-hover);
}

.quick-action-icon {
  color: var(--primary-600);
  transition: color 0.2s var(--ease-out);
}

.quick-action-card:hover .quick-action-icon {
  color: var(--primary-700);
}

.quick-action-label {
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-4) var(--spacing-3);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Dark mode adjustments */
:root[data-theme='dark'] .stat-card,
:root[data-theme='dark'] .section,
:root[data-theme='dark'] .task-item {
  background: var(--surface);
  border-color: var(--border);
}

:root[data-theme='dark'] .quick-action-card {
  background: var(--surface-variant);
}
</style>
