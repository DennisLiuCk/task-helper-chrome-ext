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
/* ═══════════════════════════════════════════════════════════
   CYBER COMMAND PALETTE - Terminal Command Interface
   ═══════════════════════════════════════════════════════════ */

.command-palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 9999;
  /* Cyber grid overlay */
  background-image:
    linear-gradient(rgba(0, 217, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.02) 1px, transparent 1px);
  background-size: 30px 30px;
  background-color: rgba(0, 0, 0, 0.85);
}

.command-palette {
  width: 100%;
  max-width: 640px;
  background: var(--surface);
  border: 2px solid var(--primary-500);
  border-radius: var(--radius-sm);
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.5),
              0 0 60px rgba(0, 217, 255, 0.3),
              inset 0 0 20px rgba(0, 217, 255, 0.05),
              0 20px 80px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  position: relative;
}

/* Corner accents */
.command-palette::before,
.command-palette::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid var(--primary-500);
  z-index: 1;
}

.command-palette::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
  box-shadow: -2px -2px 10px rgba(0, 217, 255, 0.5);
}

.command-palette::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
  box-shadow: 2px 2px 10px rgba(0, 217, 255, 0.5);
}

/* Search - Terminal Input */
.command-palette__search {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-bottom: 2px solid rgba(0, 217, 255, 0.3);
  background: linear-gradient(180deg, rgba(0, 217, 255, 0.05), transparent);
  position: relative;
}

.command-palette__search::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-500), transparent);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

.search-icon {
  font-size: 20px;
  color: var(--primary-500);
  filter: drop-shadow(0 0 5px rgba(0, 217, 255, 0.6));
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-family: var(--font-mono);
  outline: none;
  position: relative;
  z-index: 2;
}

.search-input::placeholder {
  color: var(--text-disabled);
  opacity: 0.6;
}

.search-shortcut {
  padding: var(--spacing-1) var(--spacing-2);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--primary-500);
  border-radius: var(--radius-xs);
  font-size: var(--text-xs);
  color: var(--primary-400);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
  position: relative;
  z-index: 2;
}

/* Results - Command Options */
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  position: relative;
}

/* Scan line effect on hover */
.command-result::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.15), transparent);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.command-result:hover::before,
.command-result--selected::before {
  left: 100%;
}

.command-result:hover,
.command-result--selected {
  background: rgba(0, 217, 255, 0.1);
  border-left-color: var(--primary-500);
  box-shadow: inset 0 0 15px rgba(0, 217, 255, 0.1);
}

.result-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
  filter: drop-shadow(0 0 3px rgba(0, 217, 255, 0.5));
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: var(--radius-xs);
  font-size: 10px;
  color: var(--primary-400);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

/* Empty State - Terminal No Results */
.command-palette__empty {
  padding: var(--spacing-8);
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  opacity: 0.2;
  margin-bottom: var(--spacing-2);
  filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.3));
}

.command-palette__empty p {
  margin: 0;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}

/* Footer - Terminal Hints */
.command-palette__footer {
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 2px solid rgba(0, 217, 255, 0.2);
  background: linear-gradient(0deg, rgba(0, 217, 255, 0.05), transparent);
  position: relative;
}

.command-palette__footer::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-500), transparent);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
}

.footer-hint {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.footer-hint kbd {
  padding: 2px var(--spacing-2);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-bold);
  color: var(--primary-400);
  box-shadow: 0 0 5px rgba(0, 217, 255, 0.2);
}

/* Transitions - Power-On CRT */
.command-palette-enter-active {
  transition: opacity 300ms ease;
}

.command-palette-leave-active {
  transition: opacity 200ms ease;
}

.command-palette-enter-from,
.command-palette-leave-to {
  opacity: 0;
}

.command-palette-enter-active .command-palette {
  animation: commandPowerOn 400ms cubic-bezier(0.65, 0, 0.35, 1);
}

.command-palette-leave-active .command-palette {
  animation: commandPowerOff 250ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes commandPowerOn {
  0% {
    transform: scaleY(0.002) translateY(-50px);
    opacity: 0;
    filter: brightness(3);
  }
  40% {
    transform: scaleY(0.5) translateY(0);
    opacity: 1;
    filter: brightness(1.5);
  }
  100% {
    transform: scaleY(1) translateY(0);
    opacity: 1;
    filter: brightness(1);
  }
}

@keyframes commandPowerOff {
  0% {
    transform: scaleY(1);
    opacity: 1;
    filter: brightness(1);
  }
  100% {
    transform: scaleY(0.002);
    opacity: 0;
    filter: brightness(2);
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .command-palette-overlay {
  background: rgba(249, 250, 251, 0.95);
  backdrop-filter: blur(10px);
}

:root[data-theme='light'] .command-palette {
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.3),
              0 20px 80px rgba(0, 0, 0, 0.2);
}
</style>
