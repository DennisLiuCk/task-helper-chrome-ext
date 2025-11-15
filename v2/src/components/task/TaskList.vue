<template>
  <div class="task-list">
    <!-- Filters and Controls -->
    <div v-if="showControls" class="task-list__controls">
      <div class="task-list__filters">
        <!-- Status Filter -->
        <Dropdown placement="bottom-start">
          <template #trigger>
            <Button variant="ghost" size="sm">
              狀態: {{ statusFilterLabel }}
            </Button>
          </template>
          <DropdownItem @click="setStatusFilter(null)">全部</DropdownItem>
          <DropdownItem @click="setStatusFilter('NA')">N/A</DropdownItem>
          <DropdownItem @click="setStatusFilter('DEV')">DEV</DropdownItem>
          <DropdownItem @click="setStatusFilter('QA')">QA</DropdownItem>
          <DropdownItem @click="setStatusFilter('UAT')">UAT</DropdownItem>
          <DropdownItem @click="setStatusFilter('DONE')">DONE</DropdownItem>
          <DropdownItem @click="setStatusFilter('BLOCKED')">BLOCKED</DropdownItem>
        </Dropdown>

        <!-- Sort Order -->
        <Dropdown placement="bottom-start">
          <template #trigger>
            <Button variant="ghost" size="sm">
              排序: {{ sortLabel }}
            </Button>
          </template>
          <DropdownItem @click="setSortOrder('createdAt-desc')">最新建立</DropdownItem>
          <DropdownItem @click="setSortOrder('createdAt-asc')">最早建立</DropdownItem>
          <DropdownItem @click="setSortOrder('updatedAt-desc')">最近更新</DropdownItem>
          <DropdownItem @click="setSortOrder('priority-desc')">優先度高到低</DropdownItem>
          <DropdownItem @click="setSortOrder('status')">依狀態</DropdownItem>
        </Dropdown>

        <!-- View Mode -->
        <div class="view-toggle">
          <button
            :class="['view-toggle-btn', { 'view-toggle-btn--active': viewMode === 'card' }]"
            @click="viewMode = 'card'"
            title="卡片檢視"
          >
            <Icon name="grid" size="sm" />
          </button>
          <button
            :class="['view-toggle-btn', { 'view-toggle-btn--active': viewMode === 'compact' }]"
            @click="viewMode = 'compact'"
            title="緊湊檢視"
          >
            <Icon name="list" size="sm" />
          </button>
        </div>
      </div>

      <div class="task-list__actions">
        <span v-if="selectedTasks.length > 0" class="selected-count">
          已選擇 {{ selectedTasks.length }} 項
        </span>
        <Button
          v-if="enableBatchSelect && selectedTasks.length > 0"
          variant="ghost"
          size="sm"
          @click="clearSelection"
        >
          清除選擇
        </Button>
        <Button
          v-if="enableBatchSelect && selectedTasks.length > 0"
          variant="primary"
          size="sm"
          @click="$emit('batch-action', selectedTasks)"
        >
          批量操作
        </Button>
      </div>
    </div>

    <!-- Task Count -->
    <div class="task-list__info">
      <span class="task-count">共 {{ filteredTasks.length }} 個任務</span>
    </div>

    <!-- Tasks -->
    <div v-if="filteredTasks.length > 0" :class="['task-list__items', `task-list__items--${viewMode}`]">
      <TransitionGroup name="task-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          :class="['task-list-item', { 'task-list-item--selected': isSelected(task) }]"
          @click="handleTaskClick(task)"
        >
          <div v-if="enableBatchSelect" class="task-checkbox">
            <input
              type="checkbox"
              :checked="isSelected(task)"
              @click.stop="toggleSelection(task)"
            />
          </div>
          <TaskCard
            :task="task"
            :compact="viewMode === 'compact'"
            :show-quick-status="showQuickStatus"
            @edit="$emit('edit', $event)"
            @delete="handleDelete"
            @pin="handlePin"
            @star="handleStar"
            @status-change="handleStatusChange"
          />
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-else class="task-list__empty">
      <div class="empty-state">
        <div class="empty-icon">
          <Icon name="tasks" size="xl" />
        </div>
        <h3>{{ emptyTitle }}</h3>
        <p>{{ emptyMessage }}</p>
        <Button v-if="showAddButton" variant="primary" @click="$emit('create')">
          新增任務
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard.vue';
import Button from '@/components/common/Button.vue';
import Icon from '@/components/common/Icon.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import { useTaskStore } from '@/stores/tasks';

interface Props {
  tasks?: Task[];
  showControls?: boolean;
  enableBatchSelect?: boolean;
  showQuickStatus?: boolean;
  showAddButton?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

interface Emits {
  (e: 'edit', task: Task): void;
  (e: 'delete', task: Task): void;
  (e: 'create'): void;
  (e: 'batch-action', tasks: Task[]): void;
  (e: 'task-click', task: Task): void;
}

const props = withDefaults(defineProps<Props>(), {
  tasks: undefined,
  showControls: true,
  enableBatchSelect: false,
  showQuickStatus: false,
  showAddButton: true,
  emptyTitle: '尚無任務',
  emptyMessage: '點擊下方按鈕新增第一個任務',
});

const emit = defineEmits<Emits>();

const taskStore = useTaskStore();

// View state
const viewMode = ref<'card' | 'compact'>('card');
const statusFilter = ref<TaskStatus | null>(null);
const sortOrder = ref<string>('createdAt-desc');
const selectedTaskIds = ref<Set<string>>(new Set());

// Computed
const allTasks = computed(() => props.tasks || taskStore.allTasks);

const filteredTasks = computed(() => {
  let tasks = [...allTasks.value];

  // Apply status filter
  if (statusFilter.value) {
    tasks = tasks.filter(t => t.status === statusFilter.value);
  }

  // Sort tasks
  tasks.sort((a, b) => {
    switch (sortOrder.value) {
      case 'createdAt-desc':
        return b.createdAt - a.createdAt;
      case 'createdAt-asc':
        return a.createdAt - b.createdAt;
      case 'updatedAt-desc':
        return b.updatedAt - a.updatedAt;
      case 'priority-desc': {
        const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const aVal = priorityOrder[a.priority || 'MEDIUM'];
        const bVal = priorityOrder[b.priority || 'MEDIUM'];
        return bVal - aVal;
      }
      case 'status': {
        const statusOrder = { BLOCKED: 1, NA: 2, DEV: 3, QA: 4, UAT: 5, DONE: 6 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      default:
        return 0;
    }
  });

  // Pinned tasks first
  tasks.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return tasks;
});

const selectedTasks = computed(() => {
  return filteredTasks.value.filter(t => selectedTaskIds.value.has(t.id));
});

const statusFilterLabel = computed(() => {
  return statusFilter.value || '全部';
});

const sortLabel = computed(() => {
  const labels: Record<string, string> = {
    'createdAt-desc': '最新建立',
    'createdAt-asc': '最早建立',
    'updatedAt-desc': '最近更新',
    'priority-desc': '優先度',
    'status': '狀態',
  };
  return labels[sortOrder.value] || '最新建立';
});

// Methods
function setStatusFilter(status: TaskStatus | null) {
  statusFilter.value = status;
}

function setSortOrder(order: string) {
  sortOrder.value = order;
}

function isSelected(task: Task): boolean {
  return selectedTaskIds.value.has(task.id);
}

function toggleSelection(task: Task) {
  if (selectedTaskIds.value.has(task.id)) {
    selectedTaskIds.value.delete(task.id);
  } else {
    selectedTaskIds.value.add(task.id);
  }
}

function clearSelection() {
  selectedTaskIds.value.clear();
}

function handleTaskClick(task: Task) {
  emit('task-click', task);
}

function handleDelete(task: Task) {
  taskStore.deleteTask(task.id);
  emit('delete', task);
}

function handlePin(task: Task) {
  taskStore.updateTask(task.id, { isPinned: !task.isPinned });
}

function handleStar(task: Task) {
  taskStore.updateTask(task.id, { isStarred: !task.isStarred });
}

function handleStatusChange(task: Task, status: TaskStatus) {
  taskStore.updateTask(task.id, { status });
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   MODERN TASK LIST - Clean Professional Task Display
   ═══════════════════════════════════════════════════════════ */

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* Controls */
.task-list__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
  padding: var(--spacing-3);
  background: var(--surface-variant);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.task-list__filters {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

.task-list__actions {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

.selected-count {
  font-size: var(--text-xs);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  color: var(--primary-600);
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--primary-alpha-10);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-full);
}

/* View Toggle */
.view-toggle {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.view-toggle-btn {
  padding: var(--spacing-2) var(--spacing-3);
  border: none;
  border-right: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle-btn:last-child {
  border-right: none;
}

.view-toggle-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.view-toggle-btn--active {
  background: var(--primary-500);
  color: white;
}

/* Info */
.task-list__info {
  font-size: 11px;
  font-family: var(--font-sans);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

/* Items */
.task-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.task-list__items--compact {
  gap: var(--spacing-2);
}

.task-list-item {
  display: flex;
  gap: var(--spacing-2);
  align-items: flex-start;
}

.task-list-item--selected :deep(.task-card) {
  border-color: var(--primary-500);
  background: var(--primary-alpha-10);
  box-shadow: var(--shadow-md);
}

.task-checkbox {
  padding-top: var(--spacing-4);
}

.task-checkbox input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  cursor: pointer;
  position: relative;
  transition: all 0.2s var(--ease-out);
}

.task-checkbox input[type="checkbox"]:hover {
  border-color: var(--border-strong);
}

.task-checkbox input[type="checkbox"]:checked {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.task-checkbox input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: var(--font-bold);
}

/* Empty State */
.task-list__empty {
  padding: var(--spacing-10) var(--spacing-4);
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-variant);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-4);
}

.empty-icon {
  color: var(--text-disabled);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: var(--text-lg);
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.empty-state p {
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  color: var(--text-secondary);
  margin: 0;
}

/* Transitions */
.task-list-move,
.task-list-enter-active {
  transition: all 0.3s var(--ease-out);
}

.task-list-leave-active {
  transition: all 0.2s var(--ease-in);
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.task-list-leave-active {
  position: absolute;
  width: 100%;
}

/* Dark mode adjustments */
:root[data-theme='dark'] .task-list__controls {
  background: var(--surface);
  border-color: var(--border);
}

:root[data-theme='dark'] .view-toggle {
  background: var(--surface-variant);
}

:root[data-theme='dark'] .task-checkbox input[type="checkbox"] {
  background: var(--surface-variant);
}

:root[data-theme='dark'] .task-list__empty {
  background: var(--surface);
}
</style>
