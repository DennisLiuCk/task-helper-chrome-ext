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
/* ═══════════════════════════════════════════════════════════
   CYBER DASHBOARD - Data Visualization Command Center
   ═══════════════════════════════════════════════════════════ */

.dashboard {
  padding: var(--spacing-6) var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

/* Cyber grid background */
.dashboard::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 217, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.dashboard > * {
  position: relative;
  z-index: 1;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(0, 217, 255, 0.3);
  border-radius: var(--radius-sm);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.2),
              inset 0 0 20px rgba(0, 0, 0, 0.5);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.header h1 {
  font-size: var(--text-2xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-400);
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
}

.header h1::before {
  content: '> ';
  color: var(--primary-500);
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Stats Grid - Holographic Data Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.stat-card {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-5);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(0, 217, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: inherit;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover::before {
  opacity: 1;
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.stat-card.clickable:hover {
  border-color: var(--primary-500);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.4),
              0 0 40px rgba(0, 217, 255, 0.2),
              inset 0 0 30px rgba(0, 217, 255, 0.05);
  transform: translateY(-4px);
}

.stat-value {
  font-size: var(--text-4xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-2);
  text-shadow: 0 0 15px currentColor;
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

/* Quick Stats - Terminal Readout */
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: var(--radius-xs);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
}

.quick-stat-icon {
  font-size: var(--text-lg);
  filter: drop-shadow(0 0 5px rgba(0, 217, 255, 0.5));
}

.quick-stat-text {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.quick-stat-text strong {
  color: var(--primary-400);
  font-weight: var(--font-bold);
  text-shadow: 0 0 5px rgba(0, 217, 255, 0.4);
}

/* Section - Terminal Panel */
.section {
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(0, 217, 255, 0.2);
  border-radius: var(--radius-sm);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid rgba(0, 217, 255, 0.2);
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-500), transparent);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
}

.section-title {
  font-size: var(--text-base);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary-400);
  margin: 0;
}

.section-title::before {
  content: '# ';
  color: var(--primary-500);
}

.view-all-link {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--primary-400);
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.view-all-link:hover {
  color: var(--primary-300);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
  transform: translateX(4px);
}

/* Recent Tasks */
.recent-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.task-item {
  padding: var(--spacing-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.task-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.1), transparent);
  transition: left 0.4s;
}

.task-item:hover::before {
  left: 100%;
}

.task-item:hover {
  border-color: var(--primary-500);
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.3);
  transform: translateX(4px);
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
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--primary-400);
}

.task-item__icons {
  display: flex;
  gap: var(--spacing-1);
  filter: drop-shadow(0 0 3px rgba(0, 217, 255, 0.5));
}

.task-item__title {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
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
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
}

.empty-state p {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-4) 0;
}

/* Quick Actions - Cyber Button Grid */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--spacing-3);
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--border);
  border-radius: var(--radius-xs);
  text-decoration: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.quick-action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.15), transparent);
  transition: left 0.3s;
}

.quick-action-card:hover::before {
  left: 100%;
}

.quick-action-card:hover {
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
  transform: translateY(-3px);
  color: var(--primary-400);
}

.quick-action-icon {
  font-size: var(--text-2xl);
  filter: drop-shadow(0 0 5px rgba(0, 217, 255, 0.3));
  transition: filter 0.2s;
}

.quick-action-card:hover .quick-action-icon {
  filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.8));
}

.quick-action-label {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-4) var(--spacing-3);
  }

  .header {
    padding: var(--spacing-3);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .header,
:root[data-theme='light'] .section,
:root[data-theme='light'] .stat-card,
:root[data-theme='light'] .task-item,
:root[data-theme='light'] .quick-action-card {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

:root[data-theme='light'] .header h1,
:root[data-theme='light'] .section-title {
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
}

:root[data-theme='light'] .dashboard::before {
  opacity: 0.3;
}
</style>
