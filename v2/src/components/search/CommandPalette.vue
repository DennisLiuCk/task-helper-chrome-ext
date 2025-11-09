<template>
  <Teleport to="body">
    <Transition name="command-palette">
      <div v-if="isOpen" class="command-palette-overlay" @click="close">
        <div class="command-palette" @click.stop>
          <!-- Search Input -->
          <div class="command-palette__search">
            <span class="search-icon">🔍</span>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜尋任務或執行指令..."
              @keydown.down.prevent="selectNext"
              @keydown.up.prevent="selectPrevious"
              @keydown.enter.prevent="executeSelected"
              @keydown.esc="close"
            />
            <kbd class="search-shortcut">ESC</kbd>
          </div>

          <!-- Results -->
          <div v-if="filteredResults.length > 0" class="command-palette__results">
            <div
              v-for="(result, index) in filteredResults"
              :key="result.id"
              :class="['command-result', { 'command-result--selected': index === selectedIndex }]"
              @click="execute(result)"
              @mouseenter="selectedIndex = index"
            >
              <div class="result-icon">{{ result.icon }}</div>
              <div class="result-content">
                <div class="result-title">{{ result.title }}</div>
                <div v-if="result.subtitle" class="result-subtitle">{{ result.subtitle }}</div>
              </div>
              <div v-if="result.badge" class="result-badge">
                <Badge :variant="result.badgeVariant" size="sm">{{ result.badge }}</Badge>
              </div>
              <kbd v-if="result.shortcut" class="result-shortcut">{{ result.shortcut }}</kbd>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="command-palette__empty">
            <div class="empty-icon">🔍</div>
            <p>找不到相關結果</p>
          </div>

          <!-- Footer -->
          <div class="command-palette__footer">
            <div class="footer-hint">
              <kbd>↑</kbd><kbd>↓</kbd> 選擇
              <kbd>↵</kbd> 執行
              <kbd>ESC</kbd> 關閉
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { Task, TaskStatus } from '@/types/task';
import { useTaskStore } from '@/stores/tasks';
import Badge from '@/components/common/Badge.vue';

interface CommandResult {
  id: string;
  type: 'task' | 'action' | 'navigation';
  title: string;
  subtitle?: string;
  icon: string;
  badge?: string;
  badgeVariant?: string;
  shortcut?: string;
  action: () => void;
  task?: Task;
}

interface Emits {
  (e: 'navigate', path: string): void;
  (e: 'create-task'): void;
  (e: 'edit-task', task: Task): void;
  (e: 'open-settings'): void;
}

const emit = defineEmits<Emits>();

const router = useRouter();
const taskStore = useTaskStore();

const isOpen = ref(false);
const searchQuery = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

// Available actions
const actions: CommandResult[] = [
  {
    id: 'new-task',
    type: 'action',
    title: '新增任務',
    icon: '➕',
    shortcut: 'N',
    action: () => {
      close();
      emit('create-task');
    },
  },
  {
    id: 'dashboard',
    type: 'navigation',
    title: '前往儀表板',
    icon: '📊',
    action: () => {
      close();
      router.push('/dashboard');
    },
  },
  {
    id: 'tasks',
    type: 'navigation',
    title: '前往任務列表',
    icon: '📋',
    action: () => {
      close();
      router.push('/tasks');
    },
  },
  {
    id: 'releases',
    type: 'navigation',
    title: '前往發布管理',
    icon: '🚀',
    action: () => {
      close();
      router.push('/releases');
    },
  },
  {
    id: 'links',
    type: 'navigation',
    title: '前往快速連結',
    icon: '🔗',
    action: () => {
      close();
      router.push('/links');
    },
  },
  {
    id: 'settings',
    type: 'navigation',
    title: '前往設定',
    icon: '⚙️',
    action: () => {
      close();
      router.push('/settings');
    },
  },
  {
    id: 'showcase',
    type: 'navigation',
    title: '查看組件展示',
    icon: '🎨',
    action: () => {
      close();
      router.push('/showcase');
    },
  },
];

// Task results
const taskResults = computed((): CommandResult[] => {
  return taskStore.allTasks.map(task => ({
    id: `task-${task.id}`,
    type: 'task',
    title: `${task.prefix}-${task.number}`,
    subtitle: task.title || '無標題',
    icon: '📄',
    badge: task.status,
    badgeVariant: getStatusVariant(task.status),
    task,
    action: () => {
      close();
      emit('edit-task', task);
    },
  }));
});

// All results
const allResults = computed(() => [...actions, ...taskResults.value]);

// Filtered results
const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return actions;
  }

  const query = searchQuery.value.toLowerCase();
  const filtered = allResults.value.filter(result => {
    const titleMatch = result.title.toLowerCase().includes(query);
    const subtitleMatch = result.subtitle?.toLowerCase().includes(query);
    return titleMatch || subtitleMatch;
  });

  // Sort: exact matches first, then partial matches
  return filtered.sort((a, b) => {
    const aExact = a.title.toLowerCase() === query;
    const bExact = b.title.toLowerCase() === query;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = a.title.toLowerCase().startsWith(query);
    const bStarts = b.title.toLowerCase().startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return 0;
  });
});

// Watch filtered results to reset selection
watch(filteredResults, () => {
  selectedIndex.value = 0;
});

// Watch isOpen to focus input
watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    searchQuery.value = '';
    selectedIndex.value = 0;
  }
});

function getStatusVariant(status: TaskStatus): string {
  const variants: Record<TaskStatus, string> = {
    NA: 'na',
    DEV: 'dev',
    QA: 'qa',
    UAT: 'uat',
    DONE: 'done',
    BLOCKED: 'blocked',
  };
  return variants[status];
}

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function toggle() {
  isOpen.value = !isOpen.value;
}

function selectNext() {
  selectedIndex.value = Math.min(selectedIndex.value + 1, filteredResults.value.length - 1);
}

function selectPrevious() {
  selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
}

function execute(result: CommandResult) {
  result.action();
}

function executeSelected() {
  if (filteredResults.value[selectedIndex.value]) {
    execute(filteredResults.value[selectedIndex.value]);
  }
}

// Keyboard shortcut (Cmd+K or Ctrl+K)
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggle();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

// Expose methods
defineExpose({
  open,
  close,
  toggle,
});
</script>

<style scoped>
.command-palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 9999;
}

.command-palette {
  width: 100%;
  max-width: 600px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

/* Search */
.command-palette__search {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border);
}

.search-icon {
  font-size: 20px;
  color: var(--text-secondary);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--text-lg);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-shortcut {
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

/* Results */
.command-palette__results {
  overflow-y: auto;
  max-height: 400px;
}

.command-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  transition: var(--transition-colors);
  border-left: 3px solid transparent;
}

.command-result:hover,
.command-result--selected {
  background: var(--primary-50);
  border-left-color: var(--primary-500);
}

.result-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-badge {
  flex-shrink: 0;
}

.result-shortcut {
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

/* Empty State */
.command-palette__empty {
  padding: var(--spacing-8);
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  opacity: 0.3;
  margin-bottom: var(--spacing-2);
}

.command-palette__empty p {
  margin: 0;
  font-size: var(--text-base);
}

/* Footer */
.command-palette__footer {
  padding: var(--spacing-2) var(--spacing-4);
  border-top: 1px solid var(--border);
  background: var(--background);
}

.footer-hint {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.footer-hint kbd {
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

/* Transitions */
.command-palette-enter-active,
.command-palette-leave-active {
  transition: opacity 0.2s ease;
}

.command-palette-enter-from,
.command-palette-leave-to {
  opacity: 0;
}

.command-palette-enter-active .command-palette,
.command-palette-leave-active .command-palette {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.command-palette-enter-from .command-palette {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.command-palette-leave-to .command-palette {
  transform: scale(0.95);
  opacity: 0;
}
</style>
