<template>
  <div class="tasks">
    <!-- Header -->
    <div class="tasks-header">
      <div class="tasks-header__left">
        <h1>任務管理</h1>
        <Badge variant="primary" size="md">{{ taskStore.allTasks.length }}</Badge>
      </div>
      <div class="tasks-header__right">
        <Button
          variant="ghost"
          size="sm"
          @click="toggleBatchSelect"
        >
          {{ batchSelectMode ? '取消批量選擇' : '批量選擇' }}
        </Button>
        <Button
          variant="primary"
          size="md"
          @click="openCreateModal"
        >
          ➕ 新增任務
        </Button>
        <Button
          variant="secondary"
          size="md"
          @click="openCommandPalette"
          title="開啟指令面板 (Cmd+K)"
        >
          🔍
        </Button>
      </div>
    </div>

    <!-- Task List -->
    <div class="tasks-content">
      <TaskList
        :show-controls="true"
        :enable-batch-select="batchSelectMode"
        :show-quick-status="true"
        @edit="handleEdit"
        @create="openCreateModal"
        @batch-action="handleBatchAction"
        @task-click="handleTaskClick"
      />
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-model:show="showTaskForm"
      :task="editingTask"
      @save="handleSave"
    />

    <!-- Command Palette -->
    <CommandPalette
      ref="commandPalette"
      @create-task="openCreateModal"
      @edit-task="handleEdit"
    />

    <!-- Batch Actions Toolbar -->
    <BatchActionsToolbar
      v-if="batchSelectMode && selectedTasks.length > 0"
      :selected-tasks="selectedTasks"
      @clear="clearSelection"
      @update="handleBatchUpdate"
    />

    <!-- Toast Container -->
    <ToastContainer />

    <!-- Welcome Modal -->
    <WelcomeModal
      :show="showWelcome"
      @close="showWelcome = false"
      @load-sample="loadSampleData"
      @skip="handleSkipWelcome"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/tasks';
import TaskList from '@/components/task/TaskList.vue';
import TaskForm from '@/components/task/TaskForm.vue';
import CommandPalette from '@/components/search/CommandPalette.vue';
import BatchActionsToolbar from '@/components/task/BatchActionsToolbar.vue';
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';
import WelcomeModal from '@/components/common/WelcomeModal.vue';
import { useToast } from '@/composables/useToast';
import { STORAGE_KEYS } from '@/types/storage';

const taskStore = useTaskStore();
const { success } = useToast();

const showTaskForm = ref(false);
const editingTask = ref<Task | null>(null);
const batchSelectMode = ref(false);
const selectedTasks = ref<Task[]>([]);
const commandPalette = ref<InstanceType<typeof CommandPalette> | null>(null);
const showWelcome = ref(false);

onMounted(async () => {
  // Load tasks from storage
  await taskStore.loadTasks();

  // Check if first time user
  const hasSeenWelcome = await chrome.storage.local.get(['hasSeenWelcome']);
  if (!hasSeenWelcome.hasSeenWelcome && taskStore.allTasks.length === 0) {
    showWelcome.value = true;
  }
});

function openCreateModal() {
  editingTask.value = null;
  showTaskForm.value = true;
}

function handleEdit(task: Task) {
  editingTask.value = task;
  showTaskForm.value = true;
}

function handleSave() {
  // Task is already saved by TaskForm, just close
  showTaskForm.value = false;
  editingTask.value = null;
}

function handleTaskClick(task: Task) {
  if (!batchSelectMode.value) {
    handleEdit(task);
  }
}

function toggleBatchSelect() {
  batchSelectMode.value = !batchSelectMode.value;
  if (!batchSelectMode.value) {
    clearSelection();
  }
}

function handleBatchAction(tasks: Task[]) {
  selectedTasks.value = tasks;
}

function clearSelection() {
  selectedTasks.value = [];
}

function handleBatchUpdate() {
  // Tasks are updated by BatchActionsToolbar
  // Just refresh the list if needed
}

function openCommandPalette() {
  commandPalette.value?.open();
}

async function loadSampleData() {
  const sampleTasks = [
    {
      prefix: 'MS-',
      number: 1001,
      title: '實現用戶登入功能',
      status: 'DEV' as const,
      service: 'Backend',
      priority: 'HIGH' as const,
      tags: ['feature', 'authentication'],
      isPinned: true,
      isStarred: false,
      estimatedHours: 8,
      actualHours: 5,
    },
    {
      prefix: 'MS-',
      number: 1002,
      title: '修復購物車計算錯誤',
      status: 'QA' as const,
      service: 'Store',
      priority: 'CRITICAL' as const,
      tags: ['bug', 'cart'],
      isPinned: false,
      isStarred: true,
      estimatedHours: 4,
      actualHours: 6,
    },
    {
      prefix: 'MS-',
      number: 1003,
      title: '優化首頁載入速度',
      status: 'DONE' as const,
      service: 'Frontend',
      priority: 'MEDIUM' as const,
      tags: ['performance', 'optimization'],
      isPinned: false,
      isStarred: false,
      estimatedHours: 6,
      actualHours: 5,
    },
    {
      prefix: 'BUILD-',
      number: 200,
      title: '設定 CI/CD 流程',
      status: 'UAT' as const,
      service: 'Gateway',
      priority: 'HIGH' as const,
      tags: ['devops', 'infrastructure'],
      isPinned: false,
      isStarred: true,
      estimatedHours: 12,
      actualHours: 10,
    },
    {
      prefix: 'MS-',
      number: 1004,
      title: '撰寫 API 文檔',
      status: 'NA' as const,
      service: 'Product',
      priority: 'LOW' as const,
      tags: ['documentation'],
      isPinned: false,
      isStarred: false,
      estimatedHours: 3,
    },
  ];

  for (const task of sampleTasks) {
    await taskStore.addTask(task);
  }

  await chrome.storage.local.set({ hasSeenWelcome: true });
  success(`已創建 ${sampleTasks.length} 個範例任務`);
}

async function handleSkipWelcome() {
  await chrome.storage.local.set({ hasSeenWelcome: true });
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CYBER TASKS VIEW - Mission Control Main Interface
   ═══════════════════════════════════════════════════════════ */

.tasks {
  padding: var(--spacing-6) var(--spacing-4);
  padding-bottom: var(--spacing-20);
  min-height: 100vh;
  position: relative;
}

/* Optional: Cyber grid background overlay */
.tasks::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 217, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.015) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.tasks > * {
  position: relative;
  z-index: 1;
}

/* Header - Terminal Command Bar */
.tasks-header {
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
  position: relative;
  overflow: hidden;
}

/* Neon underline effect */
.tasks-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-500),
    transparent
  );
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.8);
  animation: scanPulse 3s ease-in-out infinite;
}

@keyframes scanPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.tasks-header__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  position: relative;
  z-index: 1;
}

.tasks-header__left h1 {
  font-size: var(--text-2xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-400);
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
  position: relative;
}

/* Terminal prompt indicator */
.tasks-header__left h1::before {
  content: '> ';
  color: var(--primary-500);
  font-weight: var(--font-bold);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
  margin-right: var(--spacing-2);
}

/* Cursor blink effect */
.tasks-header__left h1::after {
  content: '_';
  color: var(--primary-500);
  animation: terminalBlink 1s step-end infinite;
  margin-left: var(--spacing-1);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

.tasks-header__right {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

/* Content Area */
.tasks-content {
  animation: contentFadeIn 600ms cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes contentFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .tasks {
    padding: var(--spacing-4) var(--spacing-3);
  }

  .tasks-header {
    padding: var(--spacing-3);
  }

  .tasks-header__left h1 {
    font-size: var(--text-xl);
  }

  .tasks-header__left h1::before {
    content: '';
    margin-right: 0;
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .tasks-header {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.15),
              inset 0 0 20px rgba(0, 0, 0, 0.05);
}

:root[data-theme='light'] .tasks-header__left h1 {
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
}

:root[data-theme='light'] .tasks::before {
  opacity: 0.3;
}
</style>
