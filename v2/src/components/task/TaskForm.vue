<template>
  <Modal
    v-model:show="isOpen"
    :title="isEditing ? '編輯任務' : '新增任務'"
    size="lg"
    @close="handleClose"
  >
    <form class="task-form" @submit.prevent="handleSubmit">
      <!-- Task ID -->
      <div class="form-row">
        <div class="form-group form-group--half">
          <label class="form-label">Prefix *</label>
          <select v-model="formData.prefix" class="form-select" required>
            <option v-for="prefix in availablePrefixes" :key="prefix" :value="prefix">
              {{ prefix }}
            </option>
          </select>
        </div>
        <div class="form-group form-group--half">
          <Input
            v-model="formData.number"
            type="number"
            label="Number *"
            placeholder="123"
            :required="true"
          />
        </div>
      </div>

      <!-- Title -->
      <div class="form-group">
        <Input
          v-model="formData.title"
          label="標題"
          placeholder="輸入任務標題..."
        />
      </div>

      <!-- Status and Priority -->
      <div class="form-row">
        <div class="form-group form-group--half">
          <label class="form-label">狀態 *</label>
          <select v-model="formData.status" class="form-select" required>
            <option value="NA">N/A</option>
            <option value="DEV">DEV</option>
            <option value="QA">QA</option>
            <option value="UAT">UAT</option>
            <option value="DONE">DONE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
        <div class="form-group form-group--half">
          <label class="form-label">優先度</label>
          <select v-model="formData.priority" class="form-select">
            <option :value="undefined">無</option>
            <option value="LOW">低</option>
            <option value="MEDIUM">中</option>
            <option value="HIGH">高</option>
            <option value="CRITICAL">緊急</option>
          </select>
        </div>
      </div>

      <!-- Service and Assignee -->
      <div class="form-row">
        <div class="form-group form-group--half">
          <Input
            v-model="formData.service"
            label="服務名稱"
            placeholder="例如: API Gateway"
          />
        </div>
        <div class="form-group form-group--half">
          <Input
            v-model="formData.assignee"
            label="負責人"
            placeholder="輸入負責人姓名..."
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="form-group">
        <label class="form-label">標籤</label>
        <div class="tags-input">
          <div v-if="formData.tags && formData.tags.length > 0" class="tags-list">
            <Badge
              v-for="(tag, index) in formData.tags"
              :key="index"
              variant="default"
              size="sm"
            >
              {{ tag }}
              <button type="button" class="tag-remove" @click="removeTag(index)">×</button>
            </Badge>
          </div>
          <div class="tag-input-row">
            <input
              v-model="newTag"
              type="text"
              class="tag-input"
              placeholder="輸入標籤後按 Enter..."
              @keydown.enter.prevent="addTag"
            />
            <Button type="button" variant="ghost" size="sm" @click="addTag">
              新增
            </Button>
          </div>
        </div>
      </div>

      <!-- Links -->
      <div class="form-group">
        <Input
          v-model="formData.slackLink"
          label="Slack 連結"
          type="url"
          placeholder="https://workspace.slack.com/archives/..."
        />
      </div>

      <div class="form-group">
        <Input
          v-model="formData.confluenceLink"
          label="Confluence 連結"
          type="url"
          placeholder="https://confluence.company.com/..."
        />
      </div>

      <!-- Time Estimates -->
      <div class="form-row">
        <div class="form-group form-group--half">
          <Input
            v-model="formData.estimatedHours"
            type="number"
            label="預估時數"
            placeholder="0"
            step="0.5"
            min="0"
          />
        </div>
        <div class="form-group form-group--half">
          <Input
            v-model="formData.actualHours"
            type="number"
            label="實際時數"
            placeholder="0"
            step="0.5"
            min="0"
          />
        </div>
      </div>

      <!-- Notes -->
      <div class="form-group">
        <label class="form-label">備註</label>
        <textarea
          v-model="formData.notes"
          class="form-textarea"
          placeholder="輸入備註..."
          rows="4"
        ></textarea>
      </div>

      <!-- Pin and Star -->
      <div class="form-row">
        <label class="form-checkbox">
          <input v-model="formData.isPinned" type="checkbox" />
          <span>置頂任務</span>
        </label>
        <label class="form-checkbox">
          <input v-model="formData.isStarred" type="checkbox" />
          <span>加入收藏</span>
        </label>
      </div>
    </form>

    <template #footer>
      <div class="modal-footer-actions">
        <Button variant="ghost" @click="handleClose">
          取消
        </Button>
        <Button variant="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? '儲存' : '新增' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Task, TaskStatus, Priority } from '@/types/task';
import Modal from '@/components/common/Modal.vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import { useSettingsStore } from '@/stores/settings';
import { useTaskStore } from '@/stores/tasks';
import { useToast } from '@/composables/useToast';

interface Props {
  show: boolean;
  task?: Task | null;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'save', task: Task): void;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  task: null,
});

const emit = defineEmits<Emits>();

const settingsStore = useSettingsStore();
const taskStore = useTaskStore();
const toast = useToast();

const loading = ref(false);
const newTag = ref('');

interface TaskFormData {
  prefix: string;
  number: string;
  title: string;
  status: TaskStatus;
  service: string;
  priority?: Priority;
  tags: string[];
  slackLink: string;
  confluenceLink: string;
  assignee: string;
  notes: string;
  estimatedHours: string;
  actualHours: string;
  isPinned: boolean;
  isStarred: boolean;
}

const formData = ref<TaskFormData>({
  prefix: '',
  number: '',
  title: '',
  status: 'NA',
  service: '',
  priority: undefined,
  tags: [],
  slackLink: '',
  confluenceLink: '',
  assignee: '',
  notes: '',
  estimatedHours: '',
  actualHours: '',
  isPinned: false,
  isStarred: false,
});

const isOpen = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
});

const isEditing = computed(() => !!props.task);

const availablePrefixes = computed(() => {
  return settingsStore.settings.jira.prefixes;
});

// Watch for task changes
watch(() => props.task, (task) => {
  if (task) {
    // Editing mode - populate form with task data
    formData.value = {
      prefix: task.prefix,
      number: task.number.toString(),
      title: task.title || '',
      status: task.status,
      service: task.service,
      priority: task.priority,
      tags: [...(task.tags || [])],
      slackLink: task.slackLink || '',
      confluenceLink: task.confluenceLink || '',
      assignee: task.assignee || '',
      notes: task.notes || '',
      estimatedHours: task.estimatedHours?.toString() || '',
      actualHours: task.actualHours?.toString() || '',
      isPinned: task.isPinned,
      isStarred: task.isStarred,
    };
  } else {
    // Create mode - reset form
    resetForm();
  }
}, { immediate: true });

// Watch for modal open
watch(() => props.show, (show) => {
  if (show && !props.task) {
    resetForm();
  }
});

function resetForm() {
  formData.value = {
    prefix: settingsStore.settings.jira.defaultPrefix || availablePrefixes.value[0] || '',
    number: '',
    title: '',
    status: 'NA',
    service: '',
    priority: undefined,
    tags: [],
    slackLink: '',
    confluenceLink: '',
    assignee: '',
    notes: '',
    estimatedHours: '',
    actualHours: '',
    isPinned: false,
    isStarred: false,
  };
  newTag.value = '';
}

function addTag() {
  const tag = newTag.value.trim();
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
    newTag.value = '';
  }
}

function removeTag(index: number) {
  formData.value.tags.splice(index, 1);
}

async function handleSubmit() {
  loading.value = true;

  try {
    const taskData: Partial<Task> = {
      prefix: formData.value.prefix,
      number: parseInt(formData.value.number),
      title: formData.value.title || undefined,
      status: formData.value.status,
      service: formData.value.service,
      priority: formData.value.priority,
      tags: formData.value.tags.length > 0 ? formData.value.tags : undefined,
      slackLink: formData.value.slackLink || undefined,
      confluenceLink: formData.value.confluenceLink || undefined,
      assignee: formData.value.assignee || undefined,
      notes: formData.value.notes || undefined,
      estimatedHours: formData.value.estimatedHours ? parseFloat(formData.value.estimatedHours) : undefined,
      actualHours: formData.value.actualHours ? parseFloat(formData.value.actualHours) : undefined,
      isPinned: formData.value.isPinned,
      isStarred: formData.value.isStarred,
    };

    if (isEditing.value && props.task) {
      // Update existing task
      await taskStore.updateTask(props.task.id, taskData);
      toast.success('任務已更新');
    } else {
      // Create new task
      const newTask = await taskStore.addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('任務已新增');
      emit('save', newTask);
    }

    handleClose();
  } catch (error) {
    console.error('Failed to save task:', error);
    toast.error('儲存失敗，請重試');
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  isOpen.value = false;
  resetForm();
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CYBER TASK FORM - Mission Control Data Entry
   ═══════════════════════════════════════════════════════════ */

.task-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-row {
  display: flex;
  gap: var(--spacing-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex: 1;
}

.form-group--half {
  flex: 1;
}

.form-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary-400);
  text-shadow: 0 0 5px rgba(0, 217, 255, 0.3);
}

/* Select Dropdown - Terminal Selection */
.form-select {
  width: 100%;
  height: 40px;
  padding: 0 var(--spacing-3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.form-select:hover {
  border-color: rgba(0, 217, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2),
              inset 0 0 15px rgba(0, 0, 0, 0.5);
}

.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4),
              0 0 30px rgba(0, 217, 255, 0.2),
              inset 0 0 20px rgba(0, 217, 255, 0.05);
  background: rgba(0, 217, 255, 0.05);
}

.form-select option {
  background: var(--surface);
  color: var(--text-primary);
  padding: var(--spacing-2);
}

/* Textarea - Terminal Log Input */
.form-textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.form-textarea::placeholder {
  color: var(--text-disabled);
  opacity: 0.6;
}

.form-textarea:hover {
  border-color: rgba(0, 217, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2),
              inset 0 0 15px rgba(0, 0, 0, 0.5);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4),
              0 0 30px rgba(0, 217, 255, 0.2),
              inset 0 0 20px rgba(0, 217, 255, 0.05);
  background: rgba(0, 217, 255, 0.05);
}

/* Checkbox - Cyber Toggle */
.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-checkbox:hover {
  background: rgba(0, 217, 255, 0.05);
  border-color: rgba(0, 217, 255, 0.2);
  color: var(--primary-400);
}

.form-checkbox input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: var(--radius-xs);
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.form-checkbox input[type="checkbox"]:hover {
  border-color: var(--primary-500);
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
}

.form-checkbox input[type="checkbox"]:checked {
  background: var(--primary-500);
  border-color: var(--primary-500);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5),
              inset 0 0 10px rgba(0, 217, 255, 0.3);
}

.form-checkbox input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--background);
  font-size: 12px;
  font-weight: var(--font-bold);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

/* Tags Input - Terminal Command Interface */
.tags-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tags-input:focus-within {
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.3),
              inset 0 0 20px rgba(0, 217, 255, 0.05);
  background: rgba(0, 217, 255, 0.03);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag-remove {
  margin-left: var(--spacing-1);
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  font-weight: var(--font-bold);
  line-height: 1;
  padding: 0;
  opacity: 0.6;
  transition: all 0.2s;
}

.tag-remove:hover {
  opacity: 1;
  color: var(--error);
  text-shadow: 0 0 5px var(--error-glow);
  transform: scale(1.2);
}

.tag-input-row {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

.tag-input {
  flex: 1;
  padding: var(--spacing-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  background: rgba(0, 0, 0, 0.4);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  transition: all 0.2s;
  min-height: 28px;
}

.tag-input::placeholder {
  color: var(--text-disabled);
  opacity: 0.5;
}

.tag-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
  background: rgba(0, 217, 255, 0.05);
}

/* Modal Footer */
.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Light Mode Adjustments */
:root[data-theme='light'] .form-label {
  text-shadow: none;
}

:root[data-theme='light'] .form-select,
:root[data-theme='light'] .form-textarea,
:root[data-theme='light'] .tags-input,
:root[data-theme='light'] .tag-input {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .form-select:focus,
:root[data-theme='light'] .form-textarea:focus {
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 217, 255, 0.05);
}

:root[data-theme='light'] .form-checkbox input[type="checkbox"] {
  background: rgba(255, 255, 255, 0.8);
}
</style>
