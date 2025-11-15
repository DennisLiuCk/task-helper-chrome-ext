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
/* ═══════════════════════════════════════════════════════════
   CYBER TASK CARD - Mission Control Task Display
   ═══════════════════════════════════════════════════════════ */

.task-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);     /* Sharper corners */
  padding: var(--spacing-4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3),
              0 2px 8px rgba(0, 0, 0, 0.4);
}

/* Scan line effect on hover */
.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.1),
    transparent
  );
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
}

.task-card:hover::before {
  left: 100%;
}

/* Neon border glow on hover */
.task-card:hover {
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4),
              0 0 30px rgba(0, 217, 255, 0.2),
              inset 0 0 20px rgba(0, 217, 255, 0.05),
              0 4px 12px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}

/* Pinned state - Amber Warning Glow */
.task-card--pinned {
  border-color: var(--warning);
  background: var(--surface);
  box-shadow: 0 0 20px var(--warning-glow),
              inset 0 0 20px rgba(255, 184, 0, 0.08),
              0 4px 12px rgba(0, 0, 0, 0.5);
  animation: amberPulseCard 3s ease-in-out infinite;
}

.task-card--pinned::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--warning),
    transparent
  );
  box-shadow: 0 0 10px var(--warning);
}

@keyframes amberPulseCard {
  0%, 100% {
    box-shadow: 0 0 20px var(--warning-glow),
                inset 0 0 20px rgba(255, 184, 0, 0.08),
                0 4px 12px rgba(0, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 30px var(--warning-glow),
                inset 0 0 30px rgba(255, 184, 0, 0.12),
                0 6px 16px rgba(0, 0, 0, 0.6);
  }
}

/* Starred state - Cyan Accent Border */
.task-card--starred {
  border-left: 4px solid var(--primary-500);
  box-shadow: -4px 0 15px rgba(0, 217, 255, 0.4),
              inset 0 0 10px rgba(0, 0, 0, 0.3),
              0 2px 8px rgba(0, 0, 0, 0.4);
}

/* Header - Terminal Command Bar */
.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
  padding-bottom: var(--spacing-2);
  border-bottom: 1px solid rgba(0, 217, 255, 0.15);
  position: relative;
  z-index: 2;
}

.task-card__id {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.task-id {
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  color: var(--primary-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  padding: var(--spacing-1) var(--spacing-2);
  background: rgba(0, 217, 255, 0.05);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 217, 255, 0.2);
}

.task-card__actions {
  display: flex;
  gap: var(--spacing-1);
}

.task-action {
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-action:hover {
  background: rgba(0, 217, 255, 0.08);
  border-color: rgba(0, 217, 255, 0.3);
  color: var(--primary-400);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  transform: scale(1.1);
}

.task-action--active {
  color: var(--warning);
  background: rgba(255, 184, 0, 0.1);
  border-color: var(--warning);
  box-shadow: 0 0 10px var(--warning-glow);
}

/* Title - Mission Objective */
.task-card__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
  line-height: 1.5;
  position: relative;
  z-index: 2;
}

/* Metadata - Data Readout */
.task-card__metadata {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-2);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 217, 255, 0.1);
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
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.task-meta-value {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  text-shadow: 0 0 5px rgba(0, 217, 255, 0.3);
}

/* Tags - Data Chips */
.task-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

/* Notes - Terminal Log */
.task-card__notes {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-3);
  background: rgba(0, 0, 0, 0.4);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--primary-500);
  border-right: 1px solid rgba(0, 217, 255, 0.2);
  border-top: 1px solid rgba(0, 217, 255, 0.1);
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
  box-shadow: -3px 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 0, 0, 0.5);
  font-family: var(--font-mono);
  line-height: 1.6;
  position: relative;
}

.task-card__notes::before {
  content: '// NOTE';
  position: absolute;
  top: -10px;
  left: var(--spacing-2);
  font-size: 9px;
  color: var(--primary-500);
  background: var(--surface);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  letter-spacing: 0.1em;
  font-weight: var(--font-bold);
}

/* Footer - Status Bar */
.task-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-3);
  border-top: 1px solid rgba(0, 217, 255, 0.2);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  position: relative;
}

.task-card__footer::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.5),
    transparent
  );
  box-shadow: 0 0 5px rgba(0, 217, 255, 0.5);
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
  padding: 2px var(--spacing-2);
  background: rgba(0, 217, 255, 0.05);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 217, 255, 0.15);
}

.task-date {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

/* Quick Status - Command Buttons */
.task-card__quick-status {
  display: flex;
  gap: var(--spacing-1);
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid rgba(0, 217, 255, 0.15);
  position: relative;
}

.task-card__quick-status::before {
  content: 'QUICK STATUS';
  position: absolute;
  top: -8px;
  left: var(--spacing-2);
  font-size: 8px;
  color: var(--text-secondary);
  background: var(--surface);
  padding: 0 var(--spacing-1);
  letter-spacing: 0.1em;
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
}

.quick-status-btn {
  flex: 1;
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid rgba(0, 217, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-sm);
  font-size: 9px;
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.quick-status-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.quick-status-btn:hover {
  border-color: var(--primary-500);
  color: var(--primary-400);
  background: rgba(0, 217, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 217, 255, 0.1);
  transform: translateY(-1px);
}

.quick-status-btn:hover::before {
  transform: translateX(100%);
}

.quick-status-btn--active {
  border-color: var(--primary-500);
  background: rgba(0, 217, 255, 0.2);
  color: var(--primary-400);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.5),
              inset 0 0 15px rgba(0, 217, 255, 0.2);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

/* Status-specific colors on active */
.quick-status-btn--active:nth-child(1) { /* NA - Gray */
  border-color: var(--status-na);
  color: var(--status-na-hover);
  background: var(--status-na-bg);
}

.quick-status-btn--active:nth-child(2) { /* DEV - Amber */
  border-color: var(--status-dev);
  color: var(--status-dev);
  background: var(--status-dev-bg);
  box-shadow: 0 0 15px var(--status-dev-glow);
  text-shadow: 0 0 8px rgba(255, 184, 0, 0.6);
}

.quick-status-btn--active:nth-child(3) { /* QA - Green */
  border-color: var(--status-qa);
  color: var(--status-qa);
  background: var(--status-qa-bg);
  box-shadow: 0 0 15px var(--status-qa-glow);
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
}

.quick-status-btn--active:nth-child(4) { /* UAT - Purple */
  border-color: var(--status-uat);
  color: var(--status-uat);
  background: var(--status-uat-bg);
  box-shadow: 0 0 15px var(--status-uat-glow);
  text-shadow: 0 0 8px rgba(181, 55, 242, 0.6);
}

.quick-status-btn--active:nth-child(5) { /* DONE - Cyan */
  border-color: var(--status-done);
  color: var(--status-done);
  background: var(--status-done-bg);
  box-shadow: 0 0 20px var(--status-done-glow);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}
</style>
