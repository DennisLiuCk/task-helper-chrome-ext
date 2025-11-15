<template>
  <Transition name="batch-toolbar">
    <div v-if="selectedTasks.length > 0" class="batch-toolbar">
      <div class="batch-toolbar__content">
        <div class="batch-toolbar__info">
          <span class="batch-count">已選擇 {{ selectedTasks.length }} 個任務</span>
          <Button variant="ghost" size="sm" @click="$emit('clear')">
            清除選擇
          </Button>
        </div>

        <div class="batch-toolbar__actions">
          <!-- Status Change -->
          <Dropdown placement="top-start">
            <template #trigger>
              <Button variant="secondary" size="sm">
                變更狀態
              </Button>
            </template>
            <DropdownItem @click="handleBatchStatusChange('NA')">
              設為 N/A
            </DropdownItem>
            <DropdownItem @click="handleBatchStatusChange('DEV')">
              設為 DEV
            </DropdownItem>
            <DropdownItem @click="handleBatchStatusChange('QA')">
              設為 QA
            </DropdownItem>
            <DropdownItem @click="handleBatchStatusChange('UAT')">
              設為 UAT
            </DropdownItem>
            <DropdownItem @click="handleBatchStatusChange('DONE')">
              設為 DONE
            </DropdownItem>
            <DropdownItem @click="handleBatchStatusChange('BLOCKED')">
              設為 BLOCKED
            </DropdownItem>
          </Dropdown>

          <!-- Priority Change -->
          <Dropdown placement="top-start">
            <template #trigger>
              <Button variant="secondary" size="sm">
                設定優先度
              </Button>
            </template>
            <DropdownItem @click="handleBatchPriorityChange('LOW')">
              低
            </DropdownItem>
            <DropdownItem @click="handleBatchPriorityChange('MEDIUM')">
              中
            </DropdownItem>
            <DropdownItem @click="handleBatchPriorityChange('HIGH')">
              高
            </DropdownItem>
            <DropdownItem @click="handleBatchPriorityChange('CRITICAL')">
              緊急
            </DropdownItem>
          </Dropdown>

          <!-- Pin/Unpin -->
          <Button variant="secondary" size="sm" @click="handleTogglePin">
            {{ allPinned ? '取消置頂' : '置頂' }}
          </Button>

          <!-- Star/Unstar -->
          <Button variant="secondary" size="sm" @click="handleToggleStar">
            {{ allStarred ? '取消收藏' : '加入收藏' }}
          </Button>

          <!-- Export -->
          <Button variant="secondary" size="sm" @click="handleExport">
            匯出
          </Button>

          <!-- Delete -->
          <Button variant="danger" size="sm" @click="handleBatchDelete">
            刪除
          </Button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Batch Status Change Modal -->
  <Modal
    v-model:show="showStatusChangeModal"
    title="批量變更狀態"
    size="sm"
  >
    <p>確定要將 {{ selectedTasks.length }} 個任務的狀態變更為 <strong>{{ pendingStatus }}</strong> 嗎？</p>
    <template #footer>
      <div class="modal-footer-actions">
        <Button variant="ghost" @click="showStatusChangeModal = false">取消</Button>
        <Button variant="primary" @click="confirmStatusChange">確認</Button>
      </div>
    </template>
  </Modal>

  <!-- Batch Delete Modal -->
  <Modal
    v-model:show="showDeleteModal"
    title="批量刪除任務"
    size="sm"
  >
    <p style="color: var(--error-600)">
      <strong>警告：</strong>確定要刪除 {{ selectedTasks.length }} 個任務嗎？此操作無法復原。
    </p>
    <template #footer>
      <div class="modal-footer-actions">
        <Button variant="ghost" @click="showDeleteModal = false">取消</Button>
        <Button variant="danger" @click="confirmDelete">刪除</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Task, TaskStatus, Priority } from '@/types/task';
import Button from '@/components/common/Button.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import Modal from '@/components/common/Modal.vue';
import { useTaskStore } from '@/stores/tasks';
import { useToast } from '@/composables/useToast';

interface Props {
  selectedTasks: Task[];
}

interface Emits {
  (e: 'clear'): void;
  (e: 'update'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const taskStore = useTaskStore();
const toast = useToast();

const showStatusChangeModal = ref(false);
const showDeleteModal = ref(false);
const pendingStatus = ref<TaskStatus>('NA');

// Computed
const allPinned = computed(() => {
  return props.selectedTasks.every(t => t.isPinned);
});

const allStarred = computed(() => {
  return props.selectedTasks.every(t => t.isStarred);
});

// Methods
function handleBatchStatusChange(status: TaskStatus) {
  pendingStatus.value = status;
  showStatusChangeModal.value = true;
}

function confirmStatusChange() {
  const count = props.selectedTasks.length;
  props.selectedTasks.forEach(task => {
    taskStore.updateTask(task.id, { status: pendingStatus.value });
  });
  showStatusChangeModal.value = false;
  toast.success(`已更新 ${count} 個任務的狀態`);
  emit('update');
  emit('clear');
}

function handleBatchPriorityChange(priority: Priority) {
  const count = props.selectedTasks.length;
  props.selectedTasks.forEach(task => {
    taskStore.updateTask(task.id, { priority });
  });
  toast.success(`已更新 ${count} 個任務的優先度`);
  emit('update');
  emit('clear');
}

function handleTogglePin() {
  const newPinState = !allPinned.value;
  const count = props.selectedTasks.length;
  props.selectedTasks.forEach(task => {
    taskStore.updateTask(task.id, { isPinned: newPinState });
  });
  toast.success(`已${newPinState ? '置頂' : '取消置頂'} ${count} 個任務`);
  emit('update');
  emit('clear');
}

function handleToggleStar() {
  const newStarState = !allStarred.value;
  const count = props.selectedTasks.length;
  props.selectedTasks.forEach(task => {
    taskStore.updateTask(task.id, { isStarred: newStarState });
  });
  toast.success(`已${newStarState ? '收藏' : '取消收藏'} ${count} 個任務`);
  emit('update');
  emit('clear');
}

function handleExport() {
  try {
    const data = JSON.stringify(props.selectedTasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('任務已匯出');
  } catch (error) {
    console.error('Export failed:', error);
    toast.error('匯出失敗');
  }
}

function handleBatchDelete() {
  showDeleteModal.value = true;
}

function confirmDelete() {
  const count = props.selectedTasks.length;
  props.selectedTasks.forEach(task => {
    taskStore.deleteTask(task.id);
  });
  showDeleteModal.value = false;
  toast.success(`已刪除 ${count} 個任務`);
  emit('update');
  emit('clear');
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CYBER BATCH TOOLBAR - Mission Control Action Bar
   ═══════════════════════════════════════════════════════════ */

.batch-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 3px solid var(--primary-500);
  box-shadow: 0 -4px 20px rgba(0, 217, 255, 0.4),
              0 -8px 40px rgba(0, 217, 255, 0.2),
              0 -12px 60px rgba(0, 0, 0, 0.8);
  z-index: 1000;
  padding: var(--spacing-4);
  backdrop-filter: blur(10px);
}

/* Neon scan line effect */
.batch-toolbar::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 0;
  right: 0;
  height: 3px;
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
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.batch-toolbar__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.batch-toolbar__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.batch-count {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary-400);
  padding: var(--spacing-2) var(--spacing-3);
  background: rgba(0, 217, 255, 0.1);
  border: 2px solid var(--primary-500);
  border-radius: var(--radius-sm);
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.4),
              inset 0 0 10px rgba(0, 217, 255, 0.1);
  text-shadow: 0 0 8px rgba(0, 217, 255, 0.6);
}

.batch-toolbar__actions {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Transitions - Slide up with power-on */
.batch-toolbar-enter-active {
  animation: toolbarSlideUp 400ms cubic-bezier(0.65, 0, 0.35, 1);
}

.batch-toolbar-leave-active {
  animation: toolbarSlideDown 300ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes toolbarSlideUp {
  0% {
    transform: translateY(100%) scaleY(0.5);
    opacity: 0;
    filter: brightness(2);
  }
  60% {
    transform: translateY(-5px) scaleY(1.02);
    filter: brightness(1.2);
  }
  100% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
    filter: brightness(1);
  }
}

@keyframes toolbarSlideDown {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .batch-toolbar {
  box-shadow: 0 -4px 20px rgba(0, 217, 255, 0.3),
              0 -12px 60px rgba(0, 0, 0, 0.2);
}
</style>
