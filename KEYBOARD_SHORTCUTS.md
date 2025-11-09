# Task Helper v2.0 - 鍵盤快捷鍵規格

## 🎯 設計原則

1. **符合業界標準** - 使用常見的快捷鍵模式（如 Cmd+K 搜尋）
2. **易於記憶** - 使用助記符（如 N for New, G for Group）
3. **不衝突** - 避免與瀏覽器/系統快捷鍵衝突
4. **可自訂** - 允許用戶自訂所有快捷鍵
5. **視覺提示** - 在 UI 中顯示快捷鍵提示

---

## 🔥 全局快捷鍵

### 搜尋與導航

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + K` | 全局搜尋 | 開啟命令面板 (Command Palette) |
| `Cmd/Ctrl + P` | 快速存取 | 快速開啟任務 |
| `/` | 快速篩選 | 聚焦到篩選輸入框 |
| `Cmd/Ctrl + F` | 頁面內搜尋 | 在當前頁面搜尋 |

### 新增與建立

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + N` | 新增任務 | 開啟新增任務對話框 |
| `Cmd/Ctrl + Shift + N` | 快速新增 | 快速新增模式（最小化表單） |
| `Cmd/Ctrl + G` | 新增群組 | 建立新的發布群組 |

### 檢視切換

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + 1` | Dashboard | 切換到 Dashboard 檢視 |
| `Cmd/Ctrl + 2` | Tasks | 切換到任務列表檢視 |
| `Cmd/Ctrl + 3` | Releases | 切換到發布看板檢視 |
| `Cmd/Ctrl + 4` | Links | 切換到連結管理檢視 |
| `Cmd/Ctrl + ,` | Settings | 開啟設定頁面 |

### 外觀與偏好

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + D` | 深色模式 | 切換深色/淺色模式 |
| `Cmd/Ctrl + B` | 側邊欄 | 顯示/隱藏側邊欄（如果有） |
| `Cmd/Ctrl + \\` | 緊湊模式 | 切換緊湊/舒適檢視 |

---

## 📋 任務列表快捷鍵

### 選擇與導航

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `↑` / `↓` | 上/下移動 | 移動選中的任務 |
| `Shift + ↑/↓` | 多選 | 選擇多個連續任務 |
| `Cmd/Ctrl + Click` | 多選 | 選擇多個不連續任務 |
| `Cmd/Ctrl + A` | 全選 | 選擇所有任務 |
| `Escape` | 取消選擇 | 清除所有選擇 |
| `Enter` | 開啟任務 | 在 Jira 中開啟選中的任務 |

### 任務操作

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `E` | 編輯 | 編輯選中的任務 |
| `D` | 刪除 | 刪除選中的任務 |
| `P` | 釘選 | 釘選/取消釘選 |
| `S` | 星號 | 標記/取消標記星號 |
| `C` | 複製 | 複製任務 ID 到剪貼簿 |
| `Cmd/Ctrl + D` | 複製任務 | 複製整個任務 |

### 狀態快速切換

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `1` | NA | 將選中任務設為 NA |
| `2` | DEV | 將選中任務設為 DEV |
| `3` | QA | 將選中任務設為 QA |
| `4` | UAT | 將選中任務設為 UAT |
| `5` | DONE | 將選中任務設為 DONE |
| `0` | BLOCKED | 將選中任務設為 BLOCKED |
| `→` | 下一狀態 | 移至下一個狀態 |
| `←` | 上一狀態 | 移至上一個狀態 |

### 批量操作

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + Shift + U` | 批量更新狀態 | 開啟批量狀態更新對話框 |
| `Cmd/Ctrl + Shift + M` | 批量移動 | 批量移動到發布群組 |
| `Cmd/Ctrl + Shift + D` | 批量刪除 | 刪除所有選中的任務 |

---

## 📊 看板視圖快捷鍵

### 導航

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `←` / `→` | 左/右欄位 | 在不同狀態欄位間移動 |
| `↑` / `↓` | 上/下任務 | 在同一欄位內移動 |
| `Enter` | 開啟任務 | 在 Jira 中開啟 |
| `Space` | 選擇 | 選擇/取消選擇任務 |

### 拖放替代

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + →` | 移至右側欄位 | 將任務移至下一個狀態 |
| `Cmd/Ctrl + ←` | 移至左側欄位 | 將任務移至上一個狀態 |
| `Cmd/Ctrl + Shift + →` | 快速完成 | 直接移至 DONE 欄位 |
| `Cmd/Ctrl + Shift + ←` | 快速重置 | 直接移至 NA 欄位 |

---

## 🔍 搜尋/命令面板快捷鍵

### 基本操作

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + K` | 開啟 | 開啟命令面板 |
| `Escape` | 關閉 | 關閉命令面板 |
| `↑` / `↓` | 導航 | 在搜尋結果中移動 |
| `Enter` | 選擇 | 執行選中的動作或開啟任務 |
| `Tab` | 自動完成 | 自動完成建議 |

### 搜尋模式切換

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + T` | 任務模式 | 只搜尋任務 |
| `Cmd/Ctrl + R` | 發布模式 | 只搜尋發布群組 |
| `Cmd/Ctrl + L` | 連結模式 | 只搜尋連結 |
| `Cmd/Ctrl + H` | 歷史模式 | 只搜尋歷史記錄 |

---

## ⚙️ 對話框快捷鍵

### 通用對話框

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Enter` | 確認 | 確認並送出 |
| `Cmd/Ctrl + Enter` | 快速確認 | 確認並關閉（跳過驗證） |
| `Escape` | 取消 | 取消並關閉對話框 |
| `Tab` | 下一個欄位 | 移至下一個輸入欄位 |
| `Shift + Tab` | 上一個欄位 | 移至上一個輸入欄位 |

### 表單快捷鍵

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + S` | 保存 | 保存表單 |
| `Cmd/Ctrl + Shift + S` | 保存並新增 | 保存並開啟新表單 |
| `Cmd/Ctrl + R` | 重置 | 重置表單到預設值 |

---

## 🎛️ 設定快捷鍵

### 自訂化選項

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| `Cmd/Ctrl + ,` | 開啟設定 | 開啟設定頁面 |
| `Cmd/Ctrl + Shift + ,` | 快捷鍵設定 | 直接跳到快捷鍵設定 |
| `Cmd/Ctrl + Shift + R` | 重置設定 | 重置所有設定到預設值 |

---

## 📱 實作細節

### Composable: useKeyboard

```typescript
// composables/useKeyboard.ts
import { onMounted, onUnmounted } from 'vue';

interface KeyboardShortcuts {
  [key: string]: (e: KeyboardEvent) => void;
}

export function useKeyboard(shortcuts: KeyboardShortcuts) {
  function handleKeyDown(e: KeyboardEvent) {
    const key = formatKey(e);

    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key](e);
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    handleKeyDown,
  };
}

function formatKey(e: KeyboardEvent): string {
  const parts: string[] = [];

  if (e.ctrlKey || e.metaKey) parts.push('cmd');
  if (e.shiftKey) parts.push('shift');
  if (e.altKey) parts.push('alt');

  const key = e.key.toLowerCase();
  if (!['control', 'meta', 'shift', 'alt'].includes(key)) {
    parts.push(key);
  }

  return parts.join('+');
}
```

### 使用範例

```vue
<script setup lang="ts">
import { useKeyboard } from '@/composables/useKeyboard';
import { useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/tasks';

const router = useRouter();
const taskStore = useTaskStore();
const commandPaletteOpen = ref(false);

// 定義快捷鍵
useKeyboard({
  // Global shortcuts
  'cmd+k': () => {
    commandPaletteOpen.value = true;
  },

  'cmd+n': () => {
    router.push('/tasks/new');
  },

  'cmd+g': () => {
    router.push('/releases/new');
  },

  'cmd+1': () => router.push('/dashboard'),
  'cmd+2': () => router.push('/tasks'),
  'cmd+3': () => router.push('/releases'),
  'cmd+4': () => router.push('/links'),

  'cmd+d': () => {
    toggleDarkMode();
  },

  // Task list shortcuts
  'cmd+a': () => {
    if (isTaskListView.value) {
      selectAllTasks();
    }
  },

  'escape': () => {
    clearSelection();
  },

  // Quick status change
  '1': () => updateSelectedTasksStatus('NA'),
  '2': () => updateSelectedTasksStatus('DEV'),
  '3': () => updateSelectedTasksStatus('QA'),
  '4': () => updateSelectedTasksStatus('UAT'),
  '5': () => updateSelectedTasksStatus('DONE'),
  '0': () => updateSelectedTasksStatus('BLOCKED'),
});
</script>
```

### 快捷鍵提示組件

```vue
<template>
  <div class="shortcut-hint">
    <kbd v-for="key in keys" :key="key" class="key">
      {{ formatKeyDisplay(key) }}
    </kbd>
  </div>
</template>

<script setup lang="ts">
interface Props {
  shortcut: string; // e.g., "cmd+k", "cmd+shift+n"
}

const props = defineProps<Props>();

const keys = computed(() => props.shortcut.split('+'));

function formatKeyDisplay(key: string): string {
  const map: Record<string, string> = {
    cmd: isMac() ? '⌘' : 'Ctrl',
    shift: isMac() ? '⇧' : 'Shift',
    alt: isMac() ? '⌥' : 'Alt',
    enter: '↵',
    escape: 'Esc',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    space: 'Space',
  };

  return map[key.toLowerCase()] || key.toUpperCase();
}

function isMac() {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
</script>

<style scoped>
.shortcut-hint {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.key {
  display: inline-block;
  padding: 2px 6px;
  background: var(--gray-100);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  box-shadow: 0 1px 0 var(--border);
  min-width: 20px;
  text-align: center;
}
</style>
```

### 使用範例

```vue
<template>
  <Button>
    新增任務
    <ShortcutHint shortcut="cmd+n" />
  </Button>

  <MenuItem @click="openCommandPalette">
    搜尋
    <ShortcutHint shortcut="cmd+k" />
  </MenuItem>
</template>
```

---

## 📚 快捷鍵幫助面板

### 設計

按 `?` 或 `Cmd/Ctrl + /` 開啟快捷鍵幫助面板：

```vue
<template>
  <Modal v-model:show="showHelp" title="鍵盤快捷鍵" size="lg">
    <div class="shortcuts-help">
      <div v-for="section in shortcutSections" :key="section.title" class="section">
        <h3 class="section-title">{{ section.title }}</h3>

        <div class="shortcuts-list">
          <div
            v-for="shortcut in section.shortcuts"
            :key="shortcut.keys"
            class="shortcut-row"
          >
            <div class="shortcut-description">
              {{ shortcut.description }}
            </div>
            <ShortcutHint :shortcut="shortcut.keys" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button @click="showHelp = false">關閉</Button>
      <Button variant="ghost" @click="customizeShortcuts">
        自訂快捷鍵
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
const showHelp = ref(false);

const shortcutSections = [
  {
    title: '全局',
    shortcuts: [
      { keys: 'cmd+k', description: '全局搜尋' },
      { keys: 'cmd+n', description: '新增任務' },
      { keys: 'cmd+g', description: '新增發布群組' },
      { keys: 'cmd+,', description: '開啟設定' },
      { keys: 'cmd+d', description: '切換深色模式' },
    ],
  },
  {
    title: '導航',
    shortcuts: [
      { keys: 'cmd+1', description: 'Dashboard' },
      { keys: 'cmd+2', description: '任務列表' },
      { keys: 'cmd+3', description: '發布看板' },
      { keys: 'cmd+4', description: '連結管理' },
    ],
  },
  {
    title: '任務操作',
    shortcuts: [
      { keys: '↑/↓', description: '上/下移動' },
      { keys: 'enter', description: '開啟任務' },
      { keys: '1-5', description: '快速變更狀態' },
      { keys: 'p', description: '釘選' },
      { keys: 's', description: '標記星號' },
      { keys: 'd', description: '刪除' },
    ],
  },
];

// 監聽 ? 鍵
useKeyboard({
  '?': () => {
    showHelp.value = true;
  },
  'cmd+/': () => {
    showHelp.value = true;
  },
});
</script>

<style scoped>
.shortcuts-help {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.section-title {
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-2);
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
}

.shortcut-row:hover {
  background: var(--gray-50);
}

.shortcut-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
```

---

## 🎯 自訂快捷鍵

### 設定介面

```vue
<template>
  <div class="shortcuts-settings">
    <h3>自訂快捷鍵</h3>

    <div class="shortcuts-grid">
      <div
        v-for="shortcut in customizableShortcuts"
        :key="shortcut.id"
        class="shortcut-setting"
      >
        <div class="shortcut-label">
          {{ shortcut.label }}
        </div>

        <div class="shortcut-input">
          <input
            :value="formatShortcut(shortcut.keys)"
            readonly
            @click="recordShortcut(shortcut.id)"
            @keydown="handleShortcutRecord"
          />
          <Button
            v-if="shortcut.keys !== shortcut.default"
            variant="ghost"
            size="sm"
            @click="resetShortcut(shortcut.id)"
          >
            重置
          </Button>
        </div>
      </div>
    </div>

    <div class="actions">
      <Button @click="saveShortcuts" variant="primary">
        保存變更
      </Button>
      <Button @click="resetAllShortcuts" variant="ghost">
        重置所有
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const customizableShortcuts = ref([
  {
    id: 'global-search',
    label: '全局搜尋',
    keys: 'cmd+k',
    default: 'cmd+k',
  },
  {
    id: 'new-task',
    label: '新增任務',
    keys: 'cmd+n',
    default: 'cmd+n',
  },
  // ...更多快捷鍵
]);

const recordingShortcut = ref<string | null>(null);

function recordShortcut(id: string) {
  recordingShortcut.value = id;
}

function handleShortcutRecord(e: KeyboardEvent) {
  if (!recordingShortcut.value) return;

  e.preventDefault();

  const keys = formatKey(e);
  const shortcut = customizableShortcuts.value.find(
    s => s.id === recordingShortcut.value
  );

  if (shortcut) {
    // 檢查衝突
    const conflict = customizableShortcuts.value.find(
      s => s.id !== shortcut.id && s.keys === keys
    );

    if (conflict) {
      toast.error(`此快捷鍵已被「${conflict.label}」使用`);
      return;
    }

    shortcut.keys = keys;
  }

  recordingShortcut.value = null;
}

function resetShortcut(id: string) {
  const shortcut = customizableShortcuts.value.find(s => s.id === id);
  if (shortcut) {
    shortcut.keys = shortcut.default;
  }
}

function resetAllShortcuts() {
  customizableShortcuts.value.forEach(shortcut => {
    shortcut.keys = shortcut.default;
  });
}

async function saveShortcuts() {
  await settingsStore.updateShortcuts(
    Object.fromEntries(
      customizableShortcuts.value.map(s => [s.id, s.keys])
    )
  );
  toast.success('快捷鍵設定已保存');
}
</script>
```

---

## 🔒 衝突檢測

### 瀏覽器預設快捷鍵

以下快捷鍵應避免使用（瀏覽器預設）：

- `Cmd/Ctrl + T` - 新分頁
- `Cmd/Ctrl + W` - 關閉分頁
- `Cmd/Ctrl + R` - 重新整理
- `Cmd/Ctrl + L` - 聚焦網址列
- `Cmd/Ctrl + +/-` - 放大/縮小
- `Cmd/Ctrl + 0` - 重置縮放

### 衝突處理

```typescript
// utils/shortcut-conflicts.ts
const BROWSER_SHORTCUTS = [
  'cmd+t',
  'cmd+w',
  'cmd+r',
  'cmd+l',
  'cmd++',
  'cmd+-',
  'cmd+0',
];

export function hasConflict(shortcut: string): boolean {
  return BROWSER_SHORTCUTS.includes(shortcut.toLowerCase());
}

export function validateShortcut(shortcut: string): {
  valid: boolean;
  error?: string;
} {
  if (hasConflict(shortcut)) {
    return {
      valid: false,
      error: '此快捷鍵與瀏覽器預設快捷鍵衝突',
    };
  }

  // 其他驗證...

  return { valid: true };
}
```

---

## 📊 快捷鍵使用統計

### 追蹤最常用的快捷鍵

```typescript
// composables/useShortcutAnalytics.ts
export function useShortcutAnalytics() {
  const usage = ref<Record<string, number>>({});

  function trackShortcut(key: string) {
    usage.value[key] = (usage.value[key] || 0) + 1;

    // 保存到 storage
    chrome.storage.local.set({
      shortcutUsage: usage.value,
    });
  }

  function getTopShortcuts(limit = 10) {
    return Object.entries(usage.value)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  }

  return {
    usage,
    trackShortcut,
    getTopShortcuts,
  };
}
```

---

## 📖 總結

完整的鍵盤快捷鍵系統包括：

✅ **60+ 快捷鍵** - 覆蓋所有主要功能
✅ **自訂化** - 用戶可自訂所有快捷鍵
✅ **視覺提示** - 在 UI 中顯示快捷鍵
✅ **幫助面板** - 按 ? 查看所有快捷鍵
✅ **衝突檢測** - 避免與瀏覽器快捷鍵衝突
✅ **使用統計** - 追蹤最常用的快捷鍵
✅ **跨平台** - Mac/Windows 自動適配

這將大幅提升進階使用者的效率！🚀
