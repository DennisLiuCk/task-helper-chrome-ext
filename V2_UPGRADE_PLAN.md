# Task Helper v2.0 - 完整升級計畫

## 📋 目錄

1. [執行摘要](#執行摘要)
2. [現有問題分析](#現有問題分析)
3. [v2.0 願景與目標](#v20-願景與目標)
4. [技術架構設計](#技術架構設計)
5. [功能規格](#功能規格)
6. [UI/UX 重新設計](#uiux-重新設計)
7. [開發路線圖](#開發路線圖)
8. [測試計畫](#測試計畫)
9. [遷移策略](#遷移策略)
10. [成功指標](#成功指標)

---

## 執行摘要

Task Helper v2.0 是對現有 Jira 任務管理 Chrome 擴充功能的全面重構與升級。本次升級將：

- **重新設計 UI/UX**：現代化、流暢、優雅的介面
- **重構技術架構**：採用 Vue 3 + TypeScript + Vite
- **新增核心功能**：看板視圖、批量操作、智能搜尋、統計報表
- **提升開發者體驗**：鍵盤快捷鍵、深色模式、自訂化選項
- **優化性能**：虛擬滾動、狀態管理、動畫優化

**預估開發時間**：6-8 週
**目標發布日期**：2024 Q2

---

## 現有問題分析

### 🔴 嚴重問題

#### 1. UX 災難性缺陷

**問題：使用原生 alert/prompt/confirm**
```javascript
// 現有程式碼
if (confirm('Delete group?')) {
  // ...
}
const url = prompt('Enter Slack thread URL:', '');
```

**影響**：
- 破壞使用者流程
- 無法自訂樣式
- 體驗非常差
- 不符合現代 Web 標準

**解決方案：自訂 Modal 系統**
```vue
<Modal
  :show="showDeleteConfirm"
  title="刪除群組"
  description="確定要刪除此發布群組嗎？此操作無法復原。"
  confirmText="刪除"
  confirmVariant="danger"
  @confirm="handleDelete"
  @cancel="showDeleteConfirm = false"
/>
```

#### 2. 視覺設計過時

**問題：**
- 扁平、單調、缺乏層次
- 只有基礎的 Jira 藍色
- 無過渡動畫
- 間距不一致

**影響：**
- 看起來像 10 年前的設計
- 缺乏專業感
- 使用者體驗差

**解決方案：**
- 實作完整的設計系統（已完成：DESIGN_SYSTEM_V2.md）
- 引入陰影、漸變、模糊效果
- 流暢的動畫過渡
- 深色模式支援

#### 3. 狀態管理混亂

**問題：**
```javascript
// 狀態分散在多個地方
chrome.storage.local.get(['taskStatuses'], (result) => {
  // ...
});
chrome.storage.local.get(['taskServices'], (result) => {
  // ...
});
chrome.storage.local.get(['slackLinks'], (result) => {
  // ...
});
```

**影響：**
- 狀態不同步
- 難以追蹤變更
- 性能問題
- Bug 多

**解決方案：統一狀態管理**
```typescript
// Pinia Store
export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    statuses: new Map(),
    services: new Map(),
    slackLinks: new Map()
  }),
  actions: {
    async loadFromStorage() {
      const data = await chrome.storage.local.get(['tasks']);
      this.tasks = data.tasks || [];
    }
  }
});
```

### 🟡 中等問題

#### 4. 程式碼組織混亂

**問題：**
- 單一 1139 行檔案
- 無模組化
- 事件監聽器到處都是

**解決方案：**
```
src/
├── components/
│   ├── TaskCard.vue
│   ├── ReleaseBoard.vue
│   ├── CommandPalette.vue
│   └── ...
├── stores/
│   ├── tasks.ts
│   ├── settings.ts
│   └── ...
├── composables/
│   ├── useKeyboard.ts
│   ├── useStorage.ts
│   └── ...
└── utils/
    ├── jira.ts
    ├── format.ts
    └── ...
```

#### 5. 無響應式回饋

**問題：**
- 點擊後沒有 loading 狀態
- 成功/失敗無視覺回饋
- 使用者不知道發生了什麼

**解決方案：Toast 通知系統**
```typescript
// 成功通知
toast.success('任務已成功移至 QA 階段');

// 錯誤通知
toast.error('無法連接到 Jira，請檢查網路連線');

// Loading 狀態
const loading = ref(false);
async function updateTask() {
  loading.value = true;
  try {
    await api.updateTask();
    toast.success('更新成功');
  } catch (error) {
    toast.error('更新失敗');
  } finally {
    loading.value = false;
  }
}
```

### 🟢 輕微問題

#### 6. 無鍵盤快捷鍵
#### 7. 無批量操作
#### 8. 無深色模式
#### 9. 無統計功能
#### 10. 無資料導出

這些將在 v2.0 中全部解決。

---

## v2.0 願景與目標

### 🎯 產品願景

**"打造開發團隊最愛用的 Jira 任務管理工具"**

讓開發者能夠：
- ⚡ **快速** - 秒級存取任何任務
- 📊 **清晰** - 一眼掌握專案進度
- 🎨 **優雅** - 享受使用過程
- 🚀 **高效** - 減少重複操作

### 🎯 核心目標

1. **現代化 UI/UX**
   - Material Design 3 風格
   - 流暢的 60fps 動畫
   - 深色模式支援
   - 無障礙設計

2. **強大的功能**
   - 看板視圖（Kanban Board）
   - 批量操作
   - 智能搜尋
   - 統計報表

3. **極致性能**
   - < 100ms 互動響應時間
   - 虛擬滾動
   - 增量渲染
   - 離線支援

4. **開發者體驗**
   - 完整的鍵盤快捷鍵
   - 可自訂工作流程
   - API 整合能力
   - 資料導入/導出

---

## 技術架構設計

### 技術棧選擇

#### 前端框架：Vue 3 + TypeScript

**為什麼選擇 Vue 3？**

✅ **優點：**
- Composition API - 更好的邏輯組織
- 優秀的 TypeScript 支援
- 輕量（~50KB gzipped）
- 響應式系統性能優異
- 豐富的生態系統
- 學習曲線平緩

❌ **替代方案：**
- React：包體積較大，需要更多依賴
- Svelte：生態系統較小
- Vanilla JS：開發效率低

**決定：Vue 3 + TypeScript**

#### 建置工具：Vite

**為什麼選擇 Vite？**
- ⚡ 極快的冷啟動
- 🔥 熱模組替換（HMR）
- 📦 優化的建置輸出
- 🔧 零配置 TypeScript 支援

#### 狀態管理：Pinia

**為什麼選擇 Pinia？**
- Vue 3 官方推薦
- TypeScript 完美支援
- 模組化設計
- DevTools 支援
- 輕量（~2KB）

#### UI 組件：Headless UI + 自訂設計

**為什麼選擇 Headless UI？**
- 完全可自訂樣式
- 無障礙設計內建
- 無樣式開銷
- 與任何 CSS 方案相容

**CSS 方案：CSS Modules + CSS Variables**
- 避免全局污染
- 更好的效能
- 易於維護

#### 動畫：Vue Transition + Custom Animations

**不使用龐大的動畫庫，原因：**
- 包體積考量
- 自訂動畫更靈活
- CSS 動畫性能更好

### 專案結構

```
task-helper-v2/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── _locales/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Toast.vue
│   │   │   ├── Dropdown.vue
│   │   │   └── Badge.vue
│   │   ├── task/
│   │   │   ├── TaskCard.vue
│   │   │   ├── TaskList.vue
│   │   │   ├── TaskFilter.vue
│   │   │   └── TaskActions.vue
│   │   ├── release/
│   │   │   ├── ReleaseBoard.vue
│   │   │   ├── ReleaseColumn.vue
│   │   │   ├── ReleaseCard.vue
│   │   │   └── ReleaseStats.vue
│   │   ├── search/
│   │   │   ├── CommandPalette.vue
│   │   │   ├── SearchInput.vue
│   │   │   └── SearchResults.vue
│   │   └── dashboard/
│   │       ├── DashboardView.vue
│   │       ├── StatsCard.vue
│   │       └── ActivityTimeline.vue
│   ├── stores/
│   │   ├── tasks.ts
│   │   ├── releases.ts
│   │   ├── settings.ts
│   │   ├── ui.ts
│   │   └── history.ts
│   ├── composables/
│   │   ├── useKeyboard.ts
│   │   ├── useStorage.ts
│   │   ├── useDarkMode.ts
│   │   ├── useToast.ts
│   │   └── useDragDrop.ts
│   ├── utils/
│   │   ├── jira.ts
│   │   ├── format.ts
│   │   ├── storage.ts
│   │   ├── export.ts
│   │   └── validation.ts
│   ├── types/
│   │   ├── task.ts
│   │   ├── release.ts
│   │   ├── settings.ts
│   │   └── storage.ts
│   ├── styles/
│   │   ├── variables.css
│   │   ├── animations.css
│   │   ├── global.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── Tasks.vue
│   │   ├── Releases.vue
│   │   ├── Links.vue
│   │   └── Settings.vue
│   ├── App.vue
│   └── main.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 資料模型設計

#### Task 模型

```typescript
interface Task {
  id: string;              // MS-1234
  prefix: string;          // MS-
  number: number;          // 1234
  title?: string;          // 可選的任務標題
  status: TaskStatus;      // NA | DEV | QA | UAT | DONE | BLOCKED
  service: Service;        // Product | Store | Gateway | ...
  priority?: Priority;     // Low | Medium | High | Critical
  tags?: string[];         // 自訂標籤
  slackLink?: string;      // Slack 討論串連結
  confluenceLink?: string; // Confluence 文件連結
  assignee?: string;       // 負責人
  createdAt: number;       // 建立時間戳
  updatedAt: number;       // 更新時間戳
  completedAt?: number;    // 完成時間戳
  isPinned: boolean;       // 是否釘選
  isStarred: boolean;      // 是否標記星號
  notes?: string;          // 備註
  estimatedHours?: number; // 預估工時
  actualHours?: number;    // 實際工時
}

type TaskStatus = 'NA' | 'DEV' | 'QA' | 'UAT' | 'DONE' | 'BLOCKED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
```

#### Release Group 模型

```typescript
interface ReleaseGroup {
  id: string;              // 唯一 ID
  name: string;            // 發布名稱
  date: string;            // 發布日期 (YYYY-MM-DD)
  description?: string;    // 描述
  tasks: string[];         // Task IDs
  status: ReleaseStatus;   // Planning | InProgress | Testing | Released
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
  tags?: string[];
  isArchived: boolean;
}

type ReleaseStatus = 'PLANNING' | 'IN_PROGRESS' | 'TESTING' | 'RELEASED';
```

#### Settings 模型

```typescript
interface Settings {
  // Jira 設定
  jira: {
    baseUrl: string;
    confluenceUrl: string;
    prefixes: string[];
    defaultPrefix: string;
  };

  // UI 設定
  ui: {
    theme: 'light' | 'dark' | 'auto';
    accentColor: string;
    animationSpeed: 'fast' | 'normal' | 'slow';
    density: 'comfortable' | 'compact' | 'spacious';
    defaultView: 'dashboard' | 'tasks' | 'releases';
  };

  // 功能設定
  features: {
    enableNotifications: boolean;
    enableAutoSync: boolean;
    enableKeyboardShortcuts: boolean;
    maxHistoryItems: number;
    autoArchiveDays: number;
  };

  // 服務設定
  services: Service[];

  // 快捷鍵設定
  keyboardShortcuts: {
    globalSearch: string;
    newTask: string;
    newRelease: string;
    quickFilter: string;
    toggleDarkMode: string;
  };

  // 通知設定
  notifications: {
    dailySummary: boolean;
    dailySummaryTime: string;
    statusChanges: boolean;
    mentions: boolean;
  };
}

interface Service {
  id: string;
  name: string;
  color: string;
  icon?: string;
}
```

### 狀態管理架構

#### Task Store (Pinia)

```typescript
// stores/tasks.ts
export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: new Map<string, Task>(),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allTasks: (state) => Array.from(state.tasks.values()),

    tasksByStatus: (state) => (status: TaskStatus) => {
      return Array.from(state.tasks.values())
        .filter(task => task.status === status);
    },

    tasksByService: (state) => (service: string) => {
      return Array.from(state.tasks.values())
        .filter(task => task.service === service);
    },

    pinnedTasks: (state) => {
      return Array.from(state.tasks.values())
        .filter(task => task.isPinned)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },

    recentTasks: (state) => {
      return Array.from(state.tasks.values())
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 10);
    },

    statistics: (state) => {
      const tasks = Array.from(state.tasks.values());
      return {
        total: tasks.length,
        byStatus: {
          NA: tasks.filter(t => t.status === 'NA').length,
          DEV: tasks.filter(t => t.status === 'DEV').length,
          QA: tasks.filter(t => t.status === 'QA').length,
          UAT: tasks.filter(t => t.status === 'UAT').length,
          DONE: tasks.filter(t => t.status === 'DONE').length,
          BLOCKED: tasks.filter(t => t.status === 'BLOCKED').length,
        },
        byService: /* ... */,
      };
    },
  },

  actions: {
    async loadTasks() {
      this.loading = true;
      try {
        const data = await chrome.storage.local.get(['tasks']);
        const tasks = data.tasks || [];
        this.tasks = new Map(tasks.map(t => [t.id, t]));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async saveTasks() {
      const tasks = Array.from(this.tasks.values());
      await chrome.storage.local.set({ tasks });
    },

    async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      const newTask: Task = {
        ...task,
        id: task.prefix + task.number,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.tasks.set(newTask.id, newTask);
      await this.saveTasks();
      return newTask;
    },

    async updateTask(id: string, updates: Partial<Task>) {
      const task = this.tasks.get(id);
      if (!task) return;

      const updated = {
        ...task,
        ...updates,
        updatedAt: Date.now(),
      };
      this.tasks.set(id, updated);
      await this.saveTasks();
      return updated;
    },

    async updateTaskStatus(id: string, status: TaskStatus) {
      return this.updateTask(id, {
        status,
        ...(status === 'DONE' && { completedAt: Date.now() })
      });
    },

    async deleteTask(id: string) {
      this.tasks.delete(id);
      await this.saveTasks();
    },

    async batchUpdateStatus(ids: string[], status: TaskStatus) {
      ids.forEach(id => {
        const task = this.tasks.get(id);
        if (task) {
          this.tasks.set(id, {
            ...task,
            status,
            updatedAt: Date.now(),
            ...(status === 'DONE' && { completedAt: Date.now() })
          });
        }
      });
      await this.saveTasks();
    },

    async togglePin(id: string) {
      const task = this.tasks.get(id);
      if (task) {
        return this.updateTask(id, { isPinned: !task.isPinned });
      }
    },

    async toggleStar(id: string) {
      const task = this.tasks.get(id);
      if (task) {
        return this.updateTask(id, { isStarred: !task.isStarred });
      }
    },
  },
});
```

#### Storage Persistence

```typescript
// composables/useStorage.ts
export function useStorage() {
  const taskStore = useTaskStore();
  const releaseStore = useReleaseStore();
  const settingsStore = useSettingsStore();

  // 自動持久化
  watch(
    () => taskStore.tasks,
    () => taskStore.saveTasks(),
    { deep: true }
  );

  // 初始化時載入
  onMounted(async () => {
    await Promise.all([
      taskStore.loadTasks(),
      releaseStore.loadReleases(),
      settingsStore.loadSettings(),
    ]);
  });

  // 監聽 storage 變更（多視窗同步）
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      if (changes.tasks) {
        taskStore.loadTasks();
      }
      if (changes.releases) {
        releaseStore.loadReleases();
      }
      if (changes.settings) {
        settingsStore.loadSettings();
      }
    }
  });
}
```

---

## 功能規格

### 1. 智能搜尋系統 (Command Palette)

**快捷鍵：** `Cmd/Ctrl + K`

**功能描述：**
全局搜尋面板，可以搜尋任務、執行動作、導航頁面。

**實作細節：**

```vue
<template>
  <CommandPalette
    v-model="isOpen"
    :items="searchResults"
    placeholder="搜尋任務、執行動作..."
    @select="handleSelect"
  >
    <template #item="{ item }">
      <div class="command-item">
        <component :is="item.icon" class="icon" />
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="description">{{ item.description }}</div>
        </div>
        <kbd v-if="item.shortcut">{{ item.shortcut }}</kbd>
      </div>
    </template>
  </CommandPalette>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStore } from '@/stores/tasks';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const query = ref('');
const taskStore = useTaskStore();
const router = useRouter();

// 搜尋結果
const searchResults = computed(() => {
  if (!query.value) {
    return [
      ...recentTasks.value,
      ...quickActions.value,
    ];
  }

  return [
    ...filteredTasks.value,
    ...filteredActions.value,
    ...filteredPages.value,
  ];
});

// 最近任務
const recentTasks = computed(() =>
  taskStore.recentTasks.map(task => ({
    type: 'task',
    id: task.id,
    title: task.id,
    description: task.title || 'Open in Jira',
    icon: 'JiraIcon',
    action: () => openTask(task.id),
  }))
);

// 快速動作
const quickActions = [
  {
    type: 'action',
    id: 'new-task',
    title: '新增任務',
    description: '建立新的任務',
    icon: 'PlusIcon',
    shortcut: 'Cmd+N',
    action: () => router.push('/tasks/new'),
  },
  {
    type: 'action',
    id: 'new-release',
    title: '新增發布群組',
    description: '建立新的發布計劃',
    icon: 'CalendarIcon',
    shortcut: 'Cmd+G',
    action: () => router.push('/releases/new'),
  },
  // ...
];

// 鍵盤快捷鍵
useKeyboard({
  'cmd+k': () => isOpen.value = true,
  'esc': () => isOpen.value = false,
});
</script>
```

**搜尋邏輯：**
- 模糊搜尋任務 ID（fuzzy matching）
- 全文搜尋任務標題
- 搜尋動作和頁面
- 智能排序（最近使用、頻率、相關性）

### 2. 看板視圖 (Kanban Board)

**功能描述：**
拖放式看板，視覺化任務流程。

**實作細節：**

```vue
<template>
  <div class="kanban-board">
    <div class="board-header">
      <h2>{{ release.name }}</h2>
      <div class="actions">
        <Button @click="showStats">統計</Button>
        <Button @click="exportTasks">導出</Button>
      </div>
    </div>

    <div class="board-columns">
      <KanbanColumn
        v-for="status in statuses"
        :key="status"
        :status="status"
        :tasks="tasksByStatus[status]"
        @drop="handleDrop"
      >
        <template #header>
          <div class="column-header">
            <h3>{{ statusLabel[status] }}</h3>
            <span class="count">{{ tasksByStatus[status].length }}</span>
          </div>
        </template>

        <template #task="{ task }">
          <TaskCard
            :task="task"
            draggable
            @click="openTask(task.id)"
          />
        </template>
      </KanbanColumn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/tasks';
import { useDragDrop } from '@/composables/useDragDrop';

const taskStore = useTaskStore();
const statuses = ['NA', 'DEV', 'QA', 'UAT', 'DONE'] as const;

const tasksByStatus = computed(() => {
  return statuses.reduce((acc, status) => {
    acc[status] = taskStore.tasksByStatus(status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
});

const { handleDrop } = useDragDrop({
  onDrop: async (taskId: string, newStatus: TaskStatus) => {
    await taskStore.updateTaskStatus(taskId, newStatus);
    toast.success(`任務已移至 ${statusLabel[newStatus]}`);
  },
});
</script>
```

**拖放實作：**

```typescript
// composables/useDragDrop.ts
export function useDragDrop(options: {
  onDrop: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}) {
  const draggedTask = ref<string | null>(null);

  function handleDragStart(taskId: string) {
    draggedTask.value = taskId;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  async function handleDrop(e: DragEvent, newStatus: TaskStatus) {
    e.preventDefault();
    if (!draggedTask.value) return;

    await options.onDrop(draggedTask.value, newStatus);
    draggedTask.value = null;
  }

  return {
    draggedTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
```

### 3. 批量操作

**功能描述：**
選擇多個任務進行批量操作。

**實作細節：**

```vue
<template>
  <div class="task-list">
    <!-- 批量操作工具列 -->
    <Transition name="slide-down">
      <div v-if="selectedTasks.size > 0" class="bulk-actions">
        <div class="info">
          已選擇 {{ selectedTasks.size }} 個任務
        </div>
        <div class="actions">
          <Dropdown>
            <template #trigger>
              <Button>更改狀態</Button>
            </template>
            <template #content>
              <DropdownItem @click="bulkUpdateStatus('DEV')">
                移至開發中
              </DropdownItem>
              <DropdownItem @click="bulkUpdateStatus('QA')">
                移至測試中
              </DropdownItem>
              <DropdownItem @click="bulkUpdateStatus('UAT')">
                移至UAT
              </DropdownItem>
            </template>
          </Dropdown>

          <Dropdown>
            <template #trigger>
              <Button>更改服務</Button>
            </template>
            <!-- ... -->
          </Dropdown>

          <Button @click="bulkDelete" variant="danger">
            刪除
          </Button>
        </div>
      </div>
    </Transition>

    <!-- 任務列表 -->
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :selected="selectedTasks.has(task.id)"
      @toggle-select="toggleSelect(task.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '@/stores/tasks';
import { useToast } from '@/composables/useToast';

const taskStore = useTaskStore();
const toast = useToast();
const selectedTasks = ref(new Set<string>());

function toggleSelect(taskId: string) {
  if (selectedTasks.value.has(taskId)) {
    selectedTasks.value.delete(taskId);
  } else {
    selectedTasks.value.add(taskId);
  }
}

async function bulkUpdateStatus(status: TaskStatus) {
  const ids = Array.from(selectedTasks.value);
  await taskStore.batchUpdateStatus(ids, status);
  toast.success(`已更新 ${ids.length} 個任務狀態`);
  selectedTasks.value.clear();
}

async function bulkDelete() {
  const confirmed = await confirmDialog({
    title: '刪除任務',
    description: `確定要刪除 ${selectedTasks.value.size} 個任務嗎？`,
    confirmText: '刪除',
    confirmVariant: 'danger',
  });

  if (confirmed) {
    const ids = Array.from(selectedTasks.value);
    await Promise.all(ids.map(id => taskStore.deleteTask(id)));
    toast.success(`已刪除 ${ids.length} 個任務`);
    selectedTasks.value.clear();
  }
}
</script>
```

### 4. 統計報表

**功能描述：**
視覺化展示任務統計資訊。

**實作：**

```vue
<template>
  <div class="dashboard">
    <!-- 統計卡片 -->
    <div class="stats-grid">
      <StatsCard
        title="總任務數"
        :value="stats.total"
        icon="TaskIcon"
        trend="+12%"
        trendUp
      />

      <StatsCard
        title="開發中"
        :value="stats.byStatus.DEV"
        icon="CodeIcon"
        :color="statusColors.DEV"
      />

      <StatsCard
        title="測試中"
        :value="stats.byStatus.QA"
        icon="TestIcon"
        :color="statusColors.QA"
      />

      <StatsCard
        title="已完成"
        :value="stats.byStatus.DONE"
        icon="CheckIcon"
        :color="statusColors.DONE"
      />
    </div>

    <!-- 狀態分佈圖 -->
    <Card class="chart-card">
      <h3>狀態分佈</h3>
      <BarChart :data="statusChartData" />
    </Card>

    <!-- 服務分佈 -->
    <Card class="chart-card">
      <h3>服務分佈</h3>
      <PieChart :data="serviceChartData" />
    </Card>

    <!-- 完成趨勢 -->
    <Card class="chart-card">
      <h3>完成趨勢</h3>
      <LineChart :data="completionTrendData" />
    </Card>
  </div>
</template>
```

### 5. 資料導入/導出

**功能描述：**
支援 CSV、JSON 格式的資料導入導出。

**實作：**

```typescript
// utils/export.ts
export async function exportToCSV(tasks: Task[]) {
  const headers = [
    'Task ID',
    'Status',
    'Service',
    'Priority',
    'Created',
    'Updated',
    'Completed',
    'Slack Link',
  ];

  const rows = tasks.map(task => [
    task.id,
    task.status,
    task.service,
    task.priority || '',
    new Date(task.createdAt).toISOString(),
    new Date(task.updatedAt).toISOString(),
    task.completedAt ? new Date(task.completedAt).toISOString() : '',
    task.slackLink || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToJSON(tasks: Task[]) {
  const json = JSON.stringify(tasks, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importFromJSON(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tasks = JSON.parse(e.target!.result as string);
        resolve(tasks);
      } catch (error) {
        reject(new Error('無效的 JSON 格式'));
      }
    };
    reader.onerror = () => reject(new Error('讀取檔案失敗'));
    reader.readAsText(file);
  });
}
```

---

## UI/UX 重新設計

### 介面佈局

#### 主視窗 (400px x 600px)

```
┌────────────────────────────────────────┐ ─┐
│  🎯 Task Helper              ⚙️  [🌙]  │  │ 60px
│  [🔍 Cmd+K 搜尋...]                     │  │ Header
├────────────────────────────────────────┤ ─┤
│  [Dashboard] [Tasks] [Releases] [Links]│  │ 40px
├────────────────────────────────────────┤ ─┤
│                                        │  │
│                                        │  │
│           Content Area                 │  │ 500px
│         (可滾動, 虛擬列表)              │  │ Scrollable
│                                        │  │
│                                        │  │
│                                        │  │
└────────────────────────────────────────┘ ─┘
```

### 關鍵互動設計

#### 1. 任務卡片懸停效果

```css
.task-card {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-card:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### 2. 狀態轉換動畫

```vue
<template>
  <div class="status-progress">
    <div
      v-for="(status, index) in statuses"
      :key="status"
      class="status-node"
      :class="{
        active: index <= currentStatusIndex,
        current: index === currentStatusIndex,
      }"
    >
      <div class="node-circle">
        <CheckIcon v-if="index < currentStatusIndex" />
      </div>
      <div class="node-label">{{ statusLabel[status] }}</div>
    </div>
  </div>
</template>

<style scoped>
.status-node.active .node-circle {
  background: var(--primary-500);
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--primary-alpha-50);
  }
  50% {
    box-shadow: 0 0 0 8px var(--primary-alpha-10);
  }
}
</style>
```

#### 3. Modal 動畫

```vue
<Transition
  name="modal"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <!-- content -->
    </div>
  </div>
</Transition>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: slideUp 200ms cubic-bezier(0.0, 0, 0.2, 1);
}

.modal-leave-active .modal-content {
  animation: slideDown 200ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
```

#### 4. Toast 通知

```vue
<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
      @close="removeToast(toast.id)"
    />
  </TransitionGroup>
</template>

<style>
.toast-enter-active {
  animation: toastIn 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  animation: toastOut 200ms ease-in;
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

---

## 開發路線圖

### Phase 1: 基礎架構 (Week 1-2)

**目標：建立專案基礎**

- [x] 專案初始化
  - Vite + Vue 3 + TypeScript
  - 安裝依賴
  - 設定 ESLint + Prettier
  - 設定 Git hooks

- [ ] 設計系統實作
  - CSS Variables
  - 基礎組件（Button, Input, Modal等）
  - 動畫系統
  - 深色模式支援

- [ ] 狀態管理
  - Pinia stores
  - Chrome Storage 整合
  - 資料模型

- [ ] 路由設定
  - Vue Router
  - 頁面架構

### Phase 2: 核心功能 (Week 3-4)

**目標：實作核心任務管理功能**

- [ ] 任務管理
  - TaskCard 組件
  - TaskList 組件
  - 新增/編輯/刪除任務
  - 狀態更新
  - 服務分配

- [ ] 搜尋功能
  - Command Palette
  - 模糊搜尋
  - 最近任務
  - 快速動作

- [ ] 批量操作
  - 多選模式
  - 批量狀態更新
  - 批量刪除

### Phase 3: 進階功能 (Week 5-6)

**目標：看板視圖與統計功能**

- [ ] 看板視圖
  - ReleaseBoard 組件
  - 拖放功能
  - 泳道分組
  - WIP 限制

- [ ] Dashboard
  - 統計卡片
  - 圖表組件
  - 活動時間線

- [ ] 資料管理
  - 導入/導出
  - 備份/還原
  - 清理工具

### Phase 4: 優化與測試 (Week 7-8)

**目標：性能優化與品質保證**

- [ ] 性能優化
  - 虛擬滾動
  - 懶加載
  - 動畫優化
  - Bundle 優化

- [ ] 測試
  - 單元測試 (Vitest)
  - E2E 測試 (Playwright)
  - 手動測試

- [ ] 文件
  - 使用手冊
  - API 文件
  - 貢獻指南

- [ ] 發布準備
  - 版本號
  - Changelog
  - Chrome Web Store 資料

---

## 測試計畫

### 單元測試

```typescript
// tests/unit/stores/tasks.spec.ts
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '@/stores/tasks';

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should add a task', async () => {
    const store = useTaskStore();
    const task = await store.addTask({
      prefix: 'MS-',
      number: 1234,
      status: 'NA',
      service: 'Product',
      isPinned: false,
      isStarred: false,
    });

    expect(task.id).toBe('MS-1234');
    expect(store.tasks.has('MS-1234')).toBe(true);
  });

  it('should update task status', async () => {
    const store = useTaskStore();
    await store.addTask({ /* ... */ });
    await store.updateTaskStatus('MS-1234', 'DEV');

    const task = store.tasks.get('MS-1234');
    expect(task?.status).toBe('DEV');
    expect(task?.updatedAt).toBeGreaterThan(task?.createdAt);
  });

  it('should batch update tasks', async () => {
    const store = useTaskStore();
    await store.addTask({ prefix: 'MS-', number: 1, /* ... */ });
    await store.addTask({ prefix: 'MS-', number: 2, /* ... */ });

    await store.batchUpdateStatus(['MS-1', 'MS-2'], 'QA');

    expect(store.tasks.get('MS-1')?.status).toBe('QA');
    expect(store.tasks.get('MS-2')?.status).toBe('QA');
  });
});
```

### E2E 測試

```typescript
// tests/e2e/task-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('chrome-extension://[id]/popup.html');
  });

  test('should create a new task', async ({ page }) => {
    // 點擊新增任務按鈕
    await page.click('[data-testid="new-task"]');

    // 填寫表單
    await page.fill('[data-testid="task-prefix"]', 'MS-');
    await page.fill('[data-testid="task-number"]', '1234');
    await page.selectOption('[data-testid="task-service"]', 'Product');

    // 送出
    await page.click('[data-testid="submit"]');

    // 驗證任務已建立
    await expect(page.locator('[data-task-id="MS-1234"]')).toBeVisible();
  });

  test('should update task status via drag and drop', async ({ page }) => {
    // 找到任務卡片
    const taskCard = page.locator('[data-task-id="MS-1234"]');

    // 拖放到 QA 欄位
    await taskCard.dragTo(page.locator('[data-column="QA"]'));

    // 驗證狀態已更新
    await expect(taskCard).toHaveAttribute('data-status', 'QA');

    // 驗證 Toast 通知
    await expect(page.locator('.toast')).toContainText('任務已移至 QA');
  });

  test('should perform bulk operations', async ({ page }) => {
    // 選擇多個任務
    await page.click('[data-task-id="MS-1"] .checkbox');
    await page.click('[data-task-id="MS-2"] .checkbox');

    // 點擊批量更新狀態
    await page.click('[data-testid="bulk-update-status"]');
    await page.click('[data-testid="status-DEV"]');

    // 驗證所有任務狀態已更新
    await expect(page.locator('[data-task-id="MS-1"]')).toHaveAttribute('data-status', 'DEV');
    await expect(page.locator('[data-task-id="MS-2"]')).toHaveAttribute('data-status', 'DEV');
  });
});
```

---

## 遷移策略

### 資料遷移

**從 v1 到 v2 的資料格式轉換**

```typescript
// utils/migration.ts
export async function migrateFromV1() {
  const v1Data = await chrome.storage.local.get([
    'history',
    'releaseGroups',
    'taskStatuses',
    'taskServices',
    'slackLinks',
    'userConfig',
  ]);

  // 轉換任務資料
  const tasks: Task[] = [];
  const history = v1Data.history || [];

  for (const taskId of history) {
    const [prefix, number] = parseTaskId(taskId);
    const task: Task = {
      id: taskId,
      prefix,
      number: parseInt(number),
      status: v1Data.taskStatuses?.[taskId] || 'NA',
      service: v1Data.taskServices?.[taskId] || 'Others',
      slackLink: v1Data.slackLinks?.[taskId],
      isPinned: false,
      isStarred: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    tasks.push(task);
  }

  // 轉換發布群組
  const releases: ReleaseGroup[] = [];
  const groups = v1Data.releaseGroups || {};

  for (const [date, taskIds] of Object.entries(groups)) {
    const release: ReleaseGroup = {
      id: generateId(),
      name: `Release ${date}`,
      date,
      tasks: taskIds as string[],
      status: 'IN_PROGRESS',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
    };
    releases.push(release);
  }

  // 保存到新格式
  await chrome.storage.local.set({
    tasks,
    releases,
    settings: convertSettings(v1Data.userConfig),
    migrated: true,
    migrationVersion: 2,
  });

  // 備份 v1 資料
  await chrome.storage.local.set({
    v1Backup: v1Data,
  });
}

// 檢查是否需要遷移
export async function checkMigration() {
  const data = await chrome.storage.local.get(['migrated', 'migrationVersion']);

  if (!data.migrated) {
    await migrateFromV1();
    return true;
  }

  return false;
}
```

### 使用者通知

```vue
<template>
  <Modal v-model="showMigrationNotice">
    <div class="migration-notice">
      <h2>✨ 歡迎使用 Task Helper v2.0</h2>
      <p>我們已經成功將您的資料遷移到新版本！</p>

      <div class="migration-stats">
        <div class="stat">
          <div class="value">{{ migratedTasks }}</div>
          <div class="label">任務</div>
        </div>
        <div class="stat">
          <div class="value">{{ migratedReleases }}</div>
          <div class="label">發布群組</div>
        </div>
      </div>

      <div class="whats-new">
        <h3>🎉 新功能</h3>
        <ul>
          <li>全新的看板視圖</li>
          <li>智能搜尋 (Cmd+K)</li>
          <li>批量操作</li>
          <li>深色模式</li>
          <li>統計報表</li>
        </ul>
      </div>

      <Button @click="closeNotice" variant="primary">
        開始使用
      </Button>
    </div>
  </Modal>
</template>
```

---

## 成功指標

### 性能指標

- **初始載入時間** < 500ms
- **互動響應時間** < 100ms
- **動畫幀率** 60fps
- **記憶體使用** < 50MB
- **包大小** < 1MB (gzipped)

### 品質指標

- **單元測試覆蓋率** > 80%
- **E2E 測試覆蓋率** > 60%
- **無障礙性** WCAG 2.1 AA
- **瀏覽器相容性** Chrome 90+

### 使用者體驗指標

- **任務建立時間** < 3 秒（從點擊到完成）
- **狀態更新時間** < 1 秒
- **搜尋響應時間** < 200ms
- **首次使用完成率** > 90%

---

## 風險與挑戰

### 技術風險

1. **Chrome Extension Manifest V3 限制**
   - 風險：某些 API 可能不可用
   - 緩解：提前測試所有關鍵功能

2. **包大小控制**
   - 風險：Vue 3 + 依賴可能超過預期
   - 緩解：使用 Tree-shaking、動態導入

3. **性能優化**
   - 風險：大量任務時可能卡頓
   - 緩解：虛擬滾動、分頁載入

### 遷移風險

1. **資料遺失**
   - 風險：遷移過程可能出錯
   - 緩解：完整備份、分步驟遷移、回滾機制

2. **使用者適應**
   - 風險：新介面可能讓老用戶困惑
   - 緩解：互動式教學、文件、影片教學

---

## 總結

Task Helper v2.0 將是一個**全方位的升級**，從技術架構到使用者體驗都將達到業界領先水準。

**關鍵成功因素：**
1. ✅ 完整的設計系統
2. ✅ 現代化的技術架構
3. ✅ 以使用者為中心的功能設計
4. ✅ 嚴格的品質控制
5. ✅ 平滑的遷移策略

**下一步行動：**
1. 確認技術方案
2. 開始 Phase 1 開發
3. 建立設計原型
4. 準備測試環境

---

**預計發布時間：** 2024 Q2
**維護者：** Dennis Liu
**最後更新：** 2024-01-15
