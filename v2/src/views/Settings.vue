<template>
  <div class="settings">
    <div class="settings-header">
      <h1>設定</h1>
      <div class="settings-header__actions">
        <Button variant="secondary" size="sm" @click="handleReset">
          重置為默認
        </Button>
        <Button variant="primary" size="sm" @click="handleSave" :loading="settingsStore.loading">
          保存設定
        </Button>
      </div>
    </div>

    <div class="settings-content">
      <!-- Jira Settings -->
      <section class="settings-section">
        <h2 class="section-title">Jira 設定</h2>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">Jira Base URL</label>
            <Input
              v-model="localSettings.jira.baseUrl"
              type="url"
              placeholder="https://jira.example.com/browse/"
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">Confluence URL</label>
            <Input
              v-model="localSettings.jira.confluenceUrl"
              type="url"
              placeholder="https://jira.example.com/wiki/"
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">預設前綴</label>
            <Input
              v-model="localSettings.jira.defaultPrefix"
              placeholder="MS-"
            />
          </div>

          <div class="setting-item full-width">
            <label class="setting-label">任務前綴列表（逗號分隔）</label>
            <Input
              :model-value="localSettings.jira.prefixes.join(', ')"
              @update:model-value="handlePrefixesChange"
              placeholder="MS-, BUILD-, INFRA-"
            />
          </div>
        </div>
      </section>

      <!-- UI Settings -->
      <section class="settings-section">
        <h2 class="section-title">介面設定</h2>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">主題</label>
            <select v-model="localSettings.ui.theme" class="setting-select">
              <option value="light">淺色</option>
              <option value="dark">深色</option>
              <option value="auto">自動</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="setting-label">動畫速度</label>
            <select v-model="localSettings.ui.animationSpeed" class="setting-select">
              <option value="fast">快速</option>
              <option value="normal">正常</option>
              <option value="slow">慢速</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="setting-label">顯示密度</label>
            <select v-model="localSettings.ui.density" class="setting-select">
              <option value="compact">緊湊</option>
              <option value="comfortable">舒適</option>
              <option value="spacious">寬鬆</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="setting-label">默認視圖</label>
            <select v-model="localSettings.ui.defaultView" class="setting-select">
              <option value="dashboard">儀表板</option>
              <option value="tasks">任務</option>
              <option value="releases">發布</option>
              <option value="links">連結</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="setting-label">主色調</label>
            <input
              v-model="localSettings.ui.accentColor"
              type="color"
              class="setting-color-picker"
            />
          </div>
        </div>
      </section>

      <!-- Feature Settings -->
      <section class="settings-section">
        <h2 class="section-title">功能設定</h2>
        <div class="settings-grid">
          <div class="setting-item checkbox-item">
            <label class="checkbox-label">
              <input
                v-model="localSettings.features.enableNotifications"
                type="checkbox"
                class="setting-checkbox"
              />
              <span>啟用通知</span>
            </label>
          </div>

          <div class="setting-item checkbox-item">
            <label class="checkbox-label">
              <input
                v-model="localSettings.features.enableAutoSync"
                type="checkbox"
                class="setting-checkbox"
              />
              <span>啟用自動同步</span>
            </label>
          </div>

          <div class="setting-item checkbox-item">
            <label class="checkbox-label">
              <input
                v-model="localSettings.features.enableKeyboardShortcuts"
                type="checkbox"
                class="setting-checkbox"
              />
              <span>啟用鍵盤快速鍵</span>
            </label>
          </div>

          <div class="setting-item">
            <label class="setting-label">歷史記錄上限</label>
            <Input
              v-model.number="localSettings.features.maxHistoryItems"
              type="number"
              :min="5"
              :max="100"
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">自動歸檔天數</label>
            <Input
              v-model.number="localSettings.features.autoArchiveDays"
              type="number"
              :min="7"
              :max="365"
            />
          </div>
        </div>
      </section>

      <!-- Services -->
      <section class="settings-section">
        <h2 class="section-title">服務管理</h2>
        <div class="services-list">
          <div v-for="(service, index) in localSettings.services" :key="service.id" class="service-item">
            <div class="service-color">
              <input
                v-model="service.color"
                type="color"
                class="setting-color-picker"
              />
            </div>
            <Input
              v-model="service.name"
              placeholder="服務名稱"
              class="service-name"
            />
            <Button variant="ghost" size="sm" @click="removeService(index)">
              🗑️
            </Button>
          </div>
          <Button variant="secondary" size="sm" @click="addService">
            ➕ 新增服務
          </Button>
        </div>
      </section>

      <!-- Keyboard Shortcuts -->
      <section class="settings-section">
        <h2 class="section-title">鍵盤快速鍵</h2>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">全局搜尋</label>
            <Input
              v-model="localSettings.keyboardShortcuts.globalSearch"
              placeholder="cmd+k"
              readonly
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">新增任務</label>
            <Input
              v-model="localSettings.keyboardShortcuts.newTask"
              placeholder="cmd+n"
              readonly
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">新增發布</label>
            <Input
              v-model="localSettings.keyboardShortcuts.newRelease"
              placeholder="cmd+g"
              readonly
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">快速過濾</label>
            <Input
              v-model="localSettings.keyboardShortcuts.quickFilter"
              placeholder="/"
              readonly
            />
          </div>

          <div class="setting-item">
            <label class="setting-label">切換深色模式</label>
            <Input
              v-model="localSettings.keyboardShortcuts.toggleDarkMode"
              placeholder="cmd+d"
              readonly
            />
          </div>
        </div>
      </section>

      <!-- Notifications -->
      <section class="settings-section">
        <h2 class="section-title">通知設定</h2>
        <div class="settings-grid">
          <div class="setting-item checkbox-item">
            <label class="checkbox-label">
              <input
                v-model="localSettings.notifications.dailySummary"
                type="checkbox"
                class="setting-checkbox"
              />
              <span>每日摘要</span>
            </label>
          </div>

          <div class="setting-item">
            <label class="setting-label">每日摘要時間</label>
            <Input
              v-model="localSettings.notifications.dailySummaryTime"
              type="time"
            />
          </div>

          <div class="setting-item checkbox-item">
            <label class="checkbox-label">
              <input
                v-model="localSettings.notifications.statusChanges"
                type="checkbox"
                class="setting-checkbox"
              />
              <span>狀態變更通知</span>
            </label>
          </div>

          <div class="setting-item checkbox-item">
            <label class="checkbox-label">
              <input
                v-model="localSettings.notifications.mentions"
                type="checkbox"
                class="setting-checkbox"
              />
              <span>提及通知</span>
            </label>
          </div>
        </div>
      </section>
    </div>

    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import type { Settings, Service } from '@/types/settings';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';
import { useToast } from '@/composables/useToast';

const settingsStore = useSettingsStore();
const { success, error } = useToast();

const localSettings = ref<Settings>(JSON.parse(JSON.stringify(settingsStore.settings)));

onMounted(async () => {
  await settingsStore.loadSettings();
  localSettings.value = JSON.parse(JSON.stringify(settingsStore.settings));
});

function handlePrefixesChange(value: string) {
  localSettings.value.jira.prefixes = value
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

function addService() {
  const newService: Service = {
    id: `service-${Date.now()}`,
    name: '新服務',
    color: '#607D8B',
  };
  localSettings.value.services.push(newService);
}

function removeService(index: number) {
  localSettings.value.services.splice(index, 1);
}

async function handleSave() {
  try {
    await settingsStore.updateSettings(localSettings.value);
    success('設定已保存');

    // Apply theme immediately
    applyTheme();
  } catch (err) {
    error('保存設定失敗');
    console.error('Failed to save settings:', err);
  }
}

async function handleReset() {
  if (confirm('確定要重置所有設定為默認值嗎？')) {
    try {
      await settingsStore.resetSettings();
      localSettings.value = JSON.parse(JSON.stringify(settingsStore.settings));
      success('設定已重置');
      applyTheme();
    } catch (err) {
      error('重置設定失敗');
      console.error('Failed to reset settings:', err);
    }
  }
}

function applyTheme() {
  const theme = localSettings.value.ui.theme;

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
</script>

<style scoped>
.settings {
  padding: var(--spacing-4);
  max-width: 900px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.settings-header h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.settings-header__actions {
  display: flex;
  gap: var(--spacing-2);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.settings-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-4) 0;
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--border);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-4);
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.setting-item.full-width {
  grid-column: 1 / -1;
}

.setting-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.setting-select {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition-colors);
}

.setting-select:hover {
  border-color: var(--primary-400);
}

.setting-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.setting-color-picker {
  width: 60px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.checkbox-item {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.setting-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Services List */
.services-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.service-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.service-color {
  flex-shrink: 0;
}

.service-name {
  flex: 1;
}
</style>
