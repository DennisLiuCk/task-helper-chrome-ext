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

const taskStore = useTaskStore();

const showTaskForm = ref(false);
const editingTask = ref<Task | null>(null);
const batchSelectMode = ref(false);
const selectedTasks = ref<Task[]>([]);
const commandPalette = ref<InstanceType<typeof CommandPalette> | null>(null);

onMounted(async () => {
  // Load tasks from storage
  await taskStore.loadTasks();
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
</script>

<style scoped>
.tasks {
  padding: var(--spacing-4);
  padding-bottom: var(--spacing-20);
  min-height: 100vh;
}

/* Header */
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.tasks-header__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.tasks-header__left h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.tasks-header__right {
  display: flex;
  gap: var(--spacing-2);
}

/* Content */
.tasks-content {
  /* Task list handles its own styling */
}
</style>
