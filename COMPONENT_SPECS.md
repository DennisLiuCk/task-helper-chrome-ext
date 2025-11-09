# Task Helper v2.0 - 組件設計規格

## 📦 組件清單

### 基礎組件 (Common)

1. Button
2. Input
3. Select
4. Checkbox
5. Radio
6. Switch
7. Modal
8. Dropdown
9. Toast
10. Badge
11. Avatar
12. Card
13. Tabs
14. Tooltip
15. Loading

### 業務組件 (Feature-specific)

1. TaskCard
2. TaskList
3. TaskFilter
4. ReleaseBoard
5. ReleaseColumn
6. CommandPalette
7. StatsCard
8. ActivityTimeline

---

## 基礎組件規格

### Button

**用途：** 所有點擊動作

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: Component;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

**視覺設計：**

```vue
<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-disabled': disabled, 'btn-loading': loading, 'btn-full': fullWidth }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn-spinner">
      <LoadingIcon />
    </span>
    <component v-if="icon && iconPosition === 'left'" :is="icon" class="btn-icon-left" />
    <span class="btn-content">
      <slot />
    </span>
    <component v-if="icon && iconPosition === 'right'" :is="icon" class="btn-icon-right" />
  </button>
</template>

<style scoped>
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  border: none;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  background: var(--primary-700);
  box-shadow: var(--shadow-sm);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-500);
  border: 1px solid var(--primary-500);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--primary-50);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: none;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--gray-100);
}

/* Danger Button */
.btn-danger {
  background: var(--error);
  color: white;
  border: none;
}

.btn-danger:hover:not(:disabled) {
  background: var(--error-hover);
}

/* Sizes */
.btn-xs {
  height: 24px;
  padding: 0 var(--spacing-2);
  font-size: var(--text-xs);
}

.btn-sm {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--text-sm);
}

.btn-md {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--text-base);
}

.btn-lg {
  height: 48px;
  padding: 0 var(--spacing-6);
  font-size: var(--text-lg);
}

/* States */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Transitions */
.btn {
  transition: all var(--duration-base) var(--ease-in-out);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>
```

**使用範例：**

```vue
<!-- Primary Button -->
<Button variant="primary" @click="handleSave">
  保存
</Button>

<!-- With Icon -->
<Button variant="primary" :icon="PlusIcon" iconPosition="left">
  新增任務
</Button>

<!-- Loading State -->
<Button variant="primary" :loading="isSaving">
  保存中...
</Button>

<!-- Danger Button -->
<Button variant="danger" @click="handleDelete">
  刪除
</Button>
```

---

### Modal

**用途：** 對話框、確認框、表單

**Props:**
```typescript
interface ModalProps {
  show: boolean;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
}
```

**視覺設計：**

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div
          :class="['modal-content', `modal-${size}`]"
          @click.stop
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
        >
          <!-- Header -->
          <div v-if="title || showClose" class="modal-header">
            <h2 v-if="title" id="modal-title" class="modal-title">
              {{ title }}
            </h2>
            <button
              v-if="showClose"
              class="modal-close"
              @click="emit('close')"
              aria-label="關閉"
            >
              <XIcon />
            </button>
          </div>

          <!-- Description -->
          <p v-if="description" class="modal-description">
            {{ description }}
          </p>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = withDefaults(defineProps<ModalProps>(), {
  size: 'md',
  closeOnOverlay: true,
  closeOnEsc: true,
  showClose: true,
});

const emit = defineEmits<{
  close: [];
}>();

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    emit('close');
  }
}

// ESC key handler
watch(() => props.show, (show) => {
  if (show && props.closeOnEsc) {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        emit('close');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-4);
}

.modal-content {
  background: var(--background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-height: 90vh;
  overflow: auto;
  width: 100%;
}

.modal-sm { max-width: 400px; }
.modal-md { max-width: 600px; }
.modal-lg { max-width: 800px; }
.modal-xl { max-width: 1000px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border);
}

.modal-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--duration-base) var(--ease-in-out);
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

.modal-description {
  padding: var(--spacing-4) var(--spacing-6) 0;
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-base) var(--ease-in-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modalSlideUp var(--duration-base) var(--ease-out);
}

.modal-leave-active .modal-content {
  animation: modalSlideDown var(--duration-base) var(--ease-in);
}

@keyframes modalSlideUp {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes modalSlideDown {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
}

/* Dark Mode */
:root[data-theme="dark"] .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
```

**使用範例：**

```vue
<template>
  <Modal
    v-model:show="showDeleteModal"
    title="刪除任務"
    description="確定要刪除此任務嗎？此操作無法復原。"
  >
    <div class="task-preview">
      <TaskCard :task="selectedTask" />
    </div>

    <template #footer>
      <Button variant="ghost" @click="showDeleteModal = false">
        取消
      </Button>
      <Button variant="danger" @click="handleDelete">
        刪除
      </Button>
    </template>
  </Modal>
</template>
```

---

### Toast

**用途：** 成功/錯誤/資訊通知

**Props:**
```typescript
interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  closable?: boolean;
}
```

**實作：**

```vue
<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', `toast-${type}`]">
      <component :is="iconMap[type]" class="toast-icon" />
      <div class="toast-message">{{ message }}</div>
      <button v-if="closable" class="toast-close" @click="close">
        <XIcon />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from 'lucide-vue-next';

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  duration: 3000,
  closable: true,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};

onMounted(() => {
  visible.value = true;

  if (props.duration > 0) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});

function close() {
  visible.value = false;
  setTimeout(() => {
    emit('close');
  }, 200);
}
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 500px;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: var(--success);
}

.toast-success .toast-icon {
  color: var(--success);
}

.toast-error {
  border-left-color: var(--error);
}

.toast-error .toast-icon {
  color: var(--error);
}

.toast-warning {
  border-left-color: var(--warning);
}

.toast-warning .toast-icon {
  color: var(--warning);
}

.toast-info {
  border-left-color: var(--info);
}

.toast-info .toast-icon {
  color: var(--info);
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-in-out);
}

.toast-close:hover {
  color: var(--text-primary);
}

/* Animations */
.toast-enter-active {
  animation: toastIn var(--duration-base) var(--ease-bounce);
}

.toast-leave-active {
  animation: toastOut var(--duration-base) var(--ease-in);
}

@keyframes toastIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toastOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
```

**Toast 管理器：**

```typescript
// composables/useToast.ts
import { ref } from 'vue';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);

export function useToast() {
  function show(type: ToastItem['type'], message: string, duration = 3000) {
    const id = Math.random().toString(36).slice(2);
    toasts.value.push({ id, type, message, duration });

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  }

  function remove(id: string) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  return {
    toasts,
    success: (message: string, duration?: number) => show('success', message, duration),
    error: (message: string, duration?: number) => show('error', message, duration),
    warning: (message: string, duration?: number) => show('warning', message, duration),
    info: (message: string, duration?: number) => show('info', message, duration),
    remove,
  };
}
```

**使用範例：**

```vue
<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const toast = useToast();

async function saveTask() {
  try {
    await api.saveTask();
    toast.success('任務保存成功！');
  } catch (error) {
    toast.error('保存失敗，請重試');
  }
}
</script>
```

---

## 業務組件規格

### TaskCard

**用途：** 顯示單一任務的卡片

**Props:**
```typescript
interface TaskCardProps {
  task: Task;
  selectable?: boolean;
  selected?: boolean;
  draggable?: boolean;
  compact?: boolean;
}
```

**視覺設計：**

```vue
<template>
  <div
    :class="[
      'task-card',
      {
        'task-card-selected': selected,
        'task-card-compact': compact,
        'task-card-draggable': draggable,
      }
    ]"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @click="handleClick"
  >
    <!-- Header -->
    <div class="task-card-header">
      <div class="task-card-left">
        <Checkbox
          v-if="selectable"
          :model-value="selected"
          @update:model-value="emit('toggleSelect')"
          @click.stop
        />

        <button
          v-if="draggable"
          class="drag-handle"
          aria-label="Drag to reorder"
        >
          <GripVerticalIcon />
        </button>

        <span class="task-id" @click.stop="openInJira">
          {{ task.id }}
        </span>
      </div>

      <div class="task-card-actions">
        <button
          class="action-pin"
          :class="{ active: task.isPinned }"
          @click.stop="emit('togglePin')"
        >
          <PinIcon />
        </button>

        <button
          class="action-star"
          :class="{ active: task.isStarred }"
          @click.stop="emit('toggleStar')"
        >
          <StarIcon />
        </button>

        <Dropdown>
          <template #trigger>
            <button class="action-more">
              <MoreVerticalIcon />
            </button>
          </template>
          <template #content>
            <DropdownItem @click="emit('edit')">編輯</DropdownItem>
            <DropdownItem @click="emit('duplicate')">複製</DropdownItem>
            <DropdownDivider />
            <DropdownItem variant="danger" @click="emit('delete')">
              刪除
            </DropdownItem>
          </template>
        </Dropdown>
      </div>
    </div>

    <!-- Title (if not compact) -->
    <div v-if="!compact && task.title" class="task-card-title">
      {{ task.title }}
    </div>

    <!-- Status Progress -->
    <div v-if="!compact" class="task-card-progress">
      <StatusProgress :current="task.status" />
    </div>

    <!-- Tags -->
    <div class="task-card-tags">
      <Badge :variant="statusVariant[task.status]">
        {{ statusLabel[task.status] }}
      </Badge>

      <Badge :variant="serviceVariant[task.service]" :color="serviceColor[task.service]">
        {{ task.service }}
      </Badge>

      <Badge v-if="task.priority" :variant="priorityVariant[task.priority]">
        {{ task.priority }}
      </Badge>
    </div>

    <!-- Links (if not compact) -->
    <div v-if="!compact" class="task-card-links">
      <a
        v-if="task.slackLink"
        :href="task.slackLink"
        class="link-item"
        target="_blank"
        @click.stop
      >
        <MessageCircleIcon />
        <span>Slack</span>
      </a>

      <a
        v-if="task.confluenceLink"
        :href="task.confluenceLink"
        class="link-item"
        target="_blank"
        @click.stop
      >
        <FileTextIcon />
        <span>Confluence</span>
      </a>
    </div>

    <!-- Footer -->
    <div v-if="!compact" class="task-card-footer">
      <div class="task-card-meta">
        <span class="meta-item">
          <CalendarIcon />
          {{ formatDate(task.updatedAt) }}
        </span>

        <span v-if="task.assignee" class="meta-item">
          <UserIcon />
          {{ task.assignee }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/task';

const props = withDefaults(defineProps<TaskCardProps>(), {
  selectable: false,
  selected: false,
  draggable: false,
  compact: false,
});

const emit = defineEmits<{
  click: [];
  toggleSelect: [];
  togglePin: [];
  toggleStar: [];
  edit: [];
  duplicate: [];
  delete: [];
  dragStart: [DragEvent];
}>();

function handleClick() {
  emit('click');
}

function openInJira() {
  const url = `${settings.jira.baseUrl}${props.task.id}`;
  chrome.tabs.create({ url });
}

function handleDragStart(e: DragEvent) {
  emit('dragStart', e);
}
</script>

<style scoped>
.task-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}

.task-card-selected {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-primary);
}

.task-card-draggable {
  cursor: grab;
}

.task-card-draggable:active {
  cursor: grabbing;
}

.task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.task-card-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.drag-handle {
  color: var(--text-secondary);
  cursor: grab;
  padding: var(--spacing-1);
}

.task-id {
  font-weight: var(--font-medium);
  color: var(--primary-500);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.task-id:hover {
  text-decoration: underline;
}

.task-card-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.action-pin,
.action-star,
.action-more {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-in-out);
}

.action-pin:hover,
.action-star:hover,
.action-more:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

.action-pin.active {
  color: var(--primary-500);
}

.action-star.active {
  color: var(--warning);
}

.task-card-title {
  margin-bottom: var(--spacing-3);
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: var(--leading-snug);
}

.task-card-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-3);
}

.task-card-links {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.link-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--gray-100);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-in-out);
}

.link-item:hover {
  background: var(--gray-200);
  color: var(--text-primary);
}

.task-card-footer {
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border);
}

.task-card-meta {
  display: flex;
  gap: var(--spacing-3);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

/* Compact Mode */
.task-card-compact {
  padding: var(--spacing-2) var(--spacing-3);
}

.task-card-compact .task-card-header {
  margin-bottom: 0;
}

.task-card-compact .task-card-tags {
  margin-bottom: 0;
}
</style>
```

---

### CommandPalette

**用途：** 全局搜尋和命令執行

**Props:**
```typescript
interface CommandPaletteProps {
  show: boolean;
  placeholder?: string;
}
```

**實作：**

```vue
<template>
  <Teleport to="body">
    <Transition name="palette">
      <div v-if="show" class="palette-overlay" @click="close">
        <div class="palette-container" @click.stop>
          <!-- Search Input -->
          <div class="palette-search">
            <SearchIcon class="search-icon" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="placeholder"
              class="search-input"
              @keydown="handleKeyDown"
            />
            <kbd class="search-hint">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="palette-results">
            <div
              v-for="(group, groupIndex) in filteredResults"
              :key="groupIndex"
              class="result-group"
            >
              <div class="group-title">{{ group.title }}</div>

              <div
                v-for="(item, itemIndex) in group.items"
                :key="item.id"
                :class="['result-item', { active: isActive(groupIndex, itemIndex) }]"
                @click="selectItem(item)"
                @mouseenter="setActive(groupIndex, itemIndex)"
              >
                <component :is="item.icon" class="item-icon" />

                <div class="item-content">
                  <div class="item-title" v-html="highlightMatch(item.title, query)" />
                  <div v-if="item.description" class="item-description">
                    {{ item.description }}
                  </div>
                </div>

                <kbd v-if="item.shortcut" class="item-shortcut">
                  {{ item.shortcut }}
                </kbd>
              </div>
            </div>

            <div v-if="filteredResults.length === 0" class="no-results">
              <SearchXIcon />
              <p>找不到相關結果</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="palette-footer">
            <div class="footer-hint">
              <kbd>↑↓</kbd> 導航
              <kbd>Enter</kbd> 選擇
              <kbd>ESC</kbd> 關閉
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useTaskStore } from '@/stores/tasks';
import { useRouter } from 'vue-router';

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: '搜尋任務、執行動作...',
});

const emit = defineEmits<{
  close: [];
  select: [item: any];
}>();

const taskStore = useTaskStore();
const router = useRouter();

const query = ref('');
const inputRef = ref<HTMLInputElement>();
const activeGroup = ref(0);
const activeItem = ref(0);

// Watch for show prop to focus input
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    inputRef.value?.focus();
    query.value = '';
    activeGroup.value = 0;
    activeItem.value = 0;
  }
});

// Build search results
const filteredResults = computed(() => {
  if (!query.value) {
    return defaultResults.value;
  }

  return searchResults.value;
});

// Default results (when no query)
const defaultResults = computed(() => [
  {
    title: '最近任務',
    items: taskStore.recentTasks.slice(0, 5).map(task => ({
      id: task.id,
      type: 'task',
      title: task.id,
      description: task.title || 'Open in Jira',
      icon: 'FileIcon',
      action: () => openTask(task.id),
    })),
  },
  {
    title: '快速動作',
    items: [
      {
        id: 'new-task',
        type: 'action',
        title: '新增任務',
        description: '建立新的任務',
        icon: 'PlusIcon',
        shortcut: 'Cmd+N',
        action: () => router.push('/tasks/new'),
      },
      {
        id: 'new-release',
        type: 'action',
        title: '新增發布群組',
        description: '建立新的發布計劃',
        icon: 'CalendarIcon',
        shortcut: 'Cmd+G',
        action: () => router.push('/releases/new'),
      },
    ],
  },
]);

// Search results (with query)
const searchResults = computed(() => {
  const results = [];

  // Search tasks
  const matchedTasks = taskStore.allTasks
    .filter(task =>
      task.id.toLowerCase().includes(query.value.toLowerCase()) ||
      task.title?.toLowerCase().includes(query.value.toLowerCase())
    )
    .slice(0, 10);

  if (matchedTasks.length > 0) {
    results.push({
      title: '任務',
      items: matchedTasks.map(task => ({
        id: task.id,
        type: 'task',
        title: task.id,
        description: task.title,
        icon: 'FileIcon',
        action: () => openTask(task.id),
      })),
    });
  }

  // Search actions
  // ...

  return results;
});

function isActive(groupIndex: number, itemIndex: number) {
  return activeGroup.value === groupIndex && activeItem.value === itemIndex;
}

function setActive(groupIndex: number, itemIndex: number) {
  activeGroup.value = groupIndex;
  activeItem.value = itemIndex;
}

function selectItem(item: any) {
  item.action?.();
  emit('select', item);
  close();
}

function close() {
  emit('close');
}

function handleKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      moveDown();
      break;
    case 'ArrowUp':
      e.preventDefault();
      moveUp();
      break;
    case 'Enter':
      e.preventDefault();
      const currentItem = filteredResults.value[activeGroup.value]?.items[activeItem.value];
      if (currentItem) {
        selectItem(currentItem);
      }
      break;
    case 'Escape':
      close();
      break;
  }
}

function moveDown() {
  const currentGroup = filteredResults.value[activeGroup.value];
  if (!currentGroup) return;

  if (activeItem.value < currentGroup.items.length - 1) {
    activeItem.value++;
  } else if (activeGroup.value < filteredResults.value.length - 1) {
    activeGroup.value++;
    activeItem.value = 0;
  }
}

function moveUp() {
  if (activeItem.value > 0) {
    activeItem.value--;
  } else if (activeGroup.value > 0) {
    activeGroup.value--;
    const prevGroup = filteredResults.value[activeGroup.value];
    activeItem.value = prevGroup.items.length - 1;
  }
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function openTask(taskId: string) {
  // Open in Jira
  chrome.tabs.create({ url: `${settings.jira.baseUrl}${taskId}` });
}
</script>

<style scoped>
.palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
  padding: 100px 20px 20px;
}

.palette-container {
  max-width: 600px;
  margin: 0 auto;
  background: var(--surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

.palette-search {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-lg);
  color: var(--text-primary);
  outline: none;
}

.search-hint {
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--gray-100);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.palette-results {
  max-height: 400px;
  overflow-y: auto;
}

.result-group {
  padding: var(--spacing-2) 0;
}

.group-title {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-in-out);
}

.result-item:hover,
.result-item.active {
  background: var(--primary-50);
}

.item-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

.item-title mark {
  background: var(--primary-100);
  color: var(--primary-700);
  border-radius: var(--radius-sm);
  padding: 0 2px;
}

.item-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-shortcut {
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--gray-100);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.no-results {
  padding: var(--spacing-12) var(--spacing-4);
  text-align: center;
  color: var(--text-secondary);
}

.no-results svg {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

.palette-footer {
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 1px solid var(--border);
  background: var(--gray-50);
}

.footer-hint {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.footer-hint kbd {
  padding: var(--spacing-1) var(--spacing-2);
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}

/* Animations */
.palette-enter-active,
.palette-leave-active {
  transition: opacity var(--duration-base) var(--ease-in-out);
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-active .palette-container {
  animation: paletteSlideDown var(--duration-base) var(--ease-out);
}

.palette-leave-active .palette-container {
  animation: paletteSlideUp var(--duration-base) var(--ease-in);
}

@keyframes paletteSlideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes paletteSlideUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
}
</style>
```

---

## 總結

這份組件規格文件涵蓋了：

✅ **基礎組件**（Button, Modal, Toast）
✅ **業務組件**（TaskCard, CommandPalette）
✅ **完整的 Props 定義**
✅ **視覺設計與樣式**
✅ **動畫效果**
✅ **無障礙設計**
✅ **使用範例**

所有組件都遵循：
- 一致的設計系統
- TypeScript 型別安全
- Vue 3 Composition API
- 可重用性和可擴展性

---

**下一步：**
- 實作所有基礎組件
- 建立 Storybook 展示
- 撰寫單元測試
- 建立使用文件
