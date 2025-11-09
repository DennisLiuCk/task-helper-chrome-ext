<template>
  <div :class="['task-card', { 'task-card--pinned': task.isPinned, 'task-card--starred': task.isStarred }]">
    <!-- Header -->
    <div class="task-card__header">
      <div class="task-card__id">
        <span class="task-id">{{ task.prefix }}-{{ task.number }}</span>
        <Badge :variant="statusVariant" size="sm">{{ task.status }}</Badge>
      </div>
      <div class="task-card__actions">
        <button
          v-if="!compact"
          class="task-action"
          :class="{ 'task-action--active': task.isStarred }"
          @click="handleStar"
          title="收藏"
        >
          ★
        </button>
        <button
          v-if="!compact"
          class="task-action"
          :class="{ 'task-action--active': task.isPinned }"
          @click="handlePin"
          title="置頂"
        >
          📌
        </button>
        <Dropdown placement="bottom-end">
          <template #trigger>
            <button class="task-action">⋯</button>
          </template>
          <DropdownItem @click="handleEdit">編輯</DropdownItem>
          <DropdownItem @click="handleCopyId">複製 ID</DropdownItem>
          <DropdownItem v-if="task.slackLink" @click="openLink(task.slackLink)">
            開啟 Slack
          </DropdownItem>
          <DropdownItem v-if="task.confluenceLink" @click="openLink(task.confluenceLink)">
            開啟 Confluence
          </DropdownItem>
          <DropdownItem @click="openJira">開啟 Jira</DropdownItem>
          <DropdownItem variant="danger" @click="handleDelete">刪除</DropdownItem>
        </Dropdown>
      </div>
    </div>

    <!-- Title -->
    <div v-if="task.title || !compact" class="task-card__title">
      {{ task.title || '無標題' }}
    </div>

    <!-- Metadata -->
    <div v-if="!compact" class="task-card__metadata">
      <div v-if="task.priority" class="task-meta-item">
        <Badge :variant="priorityVariant" size="sm">
          {{ priorityLabel }}
        </Badge>
      </div>
      <div v-if="task.service" class="task-meta-item">
        <span class="task-meta-label">服務:</span>
        <span class="task-meta-value">{{ task.service }}</span>
      </div>
      <div v-if="task.assignee" class="task-meta-item">
        <span class="task-meta-label">負責人:</span>
        <span class="task-meta-value">{{ task.assignee }}</span>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="task.tags && task.tags.length > 0 && !compact" class="task-card__tags">
      <Badge
        v-for="tag in task.tags"
        :key="tag"
        variant="default"
        size="sm"
      >
        {{ tag }}
      </Badge>
    </div>

    <!-- Notes -->
    <div v-if="task.notes && !compact" class="task-card__notes">
      {{ task.notes }}
    </div>

    <!-- Footer -->
    <div v-if="showFooter && !compact" class="task-card__footer">
      <div class="task-footer-left">
        <span v-if="task.estimatedHours" class="task-time" title="預估時間">
          ⏱️ {{ task.estimatedHours }}h
        </span>
        <span v-if="task.actualHours" class="task-time" title="實際時間">
          ✓ {{ task.actualHours }}h
        </span>
      </div>
      <div class="task-footer-right">
        <span class="task-date" :title="createdAtFormatted">
          {{ relativeTime }}
        </span>
      </div>
    </div>

    <!-- Quick Status Change -->
    <div v-if="showQuickStatus && !compact" class="task-card__quick-status">
      <button
        v-for="status in quickStatuses"
        :key="status"
        :class="['quick-status-btn', { 'quick-status-btn--active': task.status === status }]"
        @click="handleStatusChange(status)"
      >
        {{ status }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task, TaskStatus } from '@/types/task';
import Badge from '@/components/common/Badge.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import { useSettingsStore } from '@/stores/settings';

interface Props {
  task: Task;
  compact?: boolean;
  showFooter?: boolean;
  showQuickStatus?: boolean;
  selectable?: boolean;
  selected?: boolean;
}

interface Emits {
  (e: 'edit', task: Task): void;
  (e: 'delete', task: Task): void;
  (e: 'pin', task: Task): void;
  (e: 'star', task: Task): void;
  (e: 'status-change', task: Task, status: TaskStatus): void;
  (e: 'select', task: Task, selected: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showFooter: true,
  showQuickStatus: false,
  selectable: false,
  selected: false,
});

const emit = defineEmits<Emits>();

const settingsStore = useSettingsStore();

// Status variant mapping
const statusVariant = computed(() => {
  const variants: Record<TaskStatus, string> = {
    NA: 'na',
    DEV: 'dev',
    QA: 'qa',
    UAT: 'uat',
    DONE: 'done',
    BLOCKED: 'blocked',
  };
  return variants[props.task.status];
});

// Priority variant and label
const priorityVariant = computed(() => {
  const variants: Record<string, string> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'error',
    CRITICAL: 'error',
  };
  return variants[props.task.priority || 'MEDIUM'];
});

const priorityLabel = computed(() => {
  const labels: Record<string, string> = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高',
    CRITICAL: '緊急',
  };
  return labels[props.task.priority || 'MEDIUM'];
});

// Quick status options
const quickStatuses: TaskStatus[] = ['NA', 'DEV', 'QA', 'UAT', 'DONE'];

// Time formatting
const createdAtFormatted = computed(() => {
  return new Date(props.task.createdAt).toLocaleString('zh-TW');
});

const relativeTime = computed(() => {
  const now = Date.now();
  const diff = now - props.task.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '剛剛';
  if (minutes < 60) return `${minutes} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  if (days < 7) return `${days} 天前`;
  return new Date(props.task.createdAt).toLocaleDateString('zh-TW');
});

// Event handlers
function handleEdit() {
  emit('edit', props.task);
}

function handleDelete() {
  if (confirm(`確定要刪除任務 ${props.task.prefix}-${props.task.number} 嗎？`)) {
    emit('delete', props.task);
  }
}

function handlePin() {
  emit('pin', props.task);
}

function handleStar() {
  emit('star', props.task);
}

function handleStatusChange(status: TaskStatus) {
  if (status !== props.task.status) {
    emit('status-change', props.task, status);
  }
}

function handleCopyId() {
  const taskId = `${props.task.prefix}-${props.task.number}`;
  navigator.clipboard.writeText(taskId);
  // Could add toast notification here
}

function openJira() {
  const baseUrl = settingsStore.settings.jira.baseUrl;
  const taskId = `${props.task.prefix}-${props.task.number}`;
  const url = `${baseUrl}/browse/${taskId}`;
  window.open(url, '_blank');
}

function openLink(url: string) {
  window.open(url, '_blank');
}
</script>

<style scoped>
.task-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  transition: var(--transition-all);
  position: relative;
}

.task-card:hover {
  border-color: var(--primary-300);
  box-shadow: var(--shadow-md);
}

.task-card--pinned {
  border-color: var(--warning-400);
  background: linear-gradient(135deg, var(--surface) 0%, var(--warning-50) 100%);
}

.task-card--starred {
  border-left: 3px solid var(--warning-500);
}

/* Header */
.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.task-card__id {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.task-id {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  color: var(--primary-600);
}

.task-card__actions {
  display: flex;
  gap: var(--spacing-1);
}

.task-action {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
  transition: var(--transition-colors);
}

.task-action:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.task-action--active {
  color: var(--warning-500);
}

/* Title */
.task-card__title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
  line-height: 1.5;
}

/* Metadata */
.task-card__metadata {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.task-meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--text-sm);
}

.task-meta-label {
  color: var(--text-secondary);
  font-size: var(--text-xs);
}

.task-meta-value {
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

/* Tags */
.task-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

/* Notes */
.task-card__notes {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-2);
  background: var(--background);
  border-radius: var(--radius-md);
  border-left: 2px solid var(--primary-300);
}

/* Footer */
.task-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.task-footer-left,
.task-footer-right {
  display: flex;
  gap: var(--spacing-3);
}

.task-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

/* Quick Status */
.task-card__quick-status {
  display: flex;
  gap: var(--spacing-1);
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border);
}

.quick-status-btn {
  flex: 1;
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--border);
  background: var(--background);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-all);
}

.quick-status-btn:hover {
  border-color: var(--primary-400);
  color: var(--primary-600);
  background: var(--primary-50);
}

.quick-status-btn--active {
  border-color: var(--primary-500);
  background: var(--primary-500);
  color: white;
}
</style>
