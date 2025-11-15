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
/* ═══════════════════════════════════════════════════════════
   CYBER SETTINGS VIEW - Configuration Command Center
   ═══════════════════════════════════════════════════════════ */

.settings {
  padding: var(--spacing-6) var(--spacing-4);
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

/* Optional: Cyber grid background overlay */
.settings::before {
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

.settings > * {
  position: relative;
  z-index: 1;
}

/* Header - Terminal Command Bar */
.settings-header {
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
.settings-header::after {
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

.settings-header h1 {
  font-size: var(--text-2xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-400);
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
  position: relative;
  z-index: 1;
}

/* Terminal prompt indicator */
.settings-header h1::before {
  content: '$ ';
  color: var(--primary-500);
  font-weight: var(--font-bold);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
  margin-right: var(--spacing-2);
}

.settings-header__actions {
  display: flex;
  gap: var(--spacing-2);
  position: relative;
  z-index: 1;
}

/* Content Area */
.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
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

/* Section - Terminal Panel */
.settings-section {
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(0, 217, 255, 0.2);
  border-radius: var(--radius-sm);
  padding: var(--spacing-6);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.1),
              inset 0 0 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.settings-section:hover {
  border-color: rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.15),
              inset 0 0 15px rgba(0, 0, 0, 0.3);
}

/* Section Title - Terminal Header */
.section-title {
  font-size: var(--text-base);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary-400);
  margin: 0 0 var(--spacing-4) 0;
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid transparent;
  position: relative;
}

/* Terminal prompt indicator */
.section-title::before {
  content: '# ';
  color: var(--primary-500);
  font-weight: var(--font-bold);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
  margin-right: var(--spacing-2);
}

/* Neon divider */
.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-500),
    transparent
  );
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
}

/* Settings Grid */
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

/* Setting Label - Monospace */
.setting-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

/* Select - Terminal Dropdown */
.setting-select {
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
}

/* Scan line hover effect */
.setting-select:hover {
  border-color: var(--primary-400);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2),
              inset 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Neon focus glow */
.setting-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4),
              0 0 30px rgba(0, 217, 255, 0.2),
              inset 0 0 20px rgba(0, 217, 255, 0.05);
  background: rgba(0, 217, 255, 0.05);
}

/* Color Picker - Neon Container */
.setting-color-picker {
  width: 60px;
  height: 36px;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3),
              inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.setting-color-picker:hover {
  border-color: var(--primary-400);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.setting-color-picker:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
}

/* Checkbox Items */
.checkbox-item {
  flex-direction: row;
  align-items: center;
  padding: var(--spacing-2);
  border-radius: var(--radius-xs);
  transition: all 0.2s;
}

.checkbox-item:hover {
  background: rgba(0, 217, 255, 0.03);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-primary);
}

/* Custom Checkbox - Cyber Style */
.setting-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: var(--radius-xs);
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  position: relative;
  flex-shrink: 0;
}

.setting-checkbox:hover {
  border-color: var(--primary-400);
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.2),
              inset 0 0 5px rgba(0, 0, 0, 0.5);
}

.setting-checkbox:checked {
  background: var(--primary-500);
  border-color: var(--primary-500);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5),
              inset 0 0 10px rgba(0, 217, 255, 0.3);
}

.setting-checkbox:checked::after {
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

.setting-checkbox:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.4),
              inset 0 0 5px rgba(0, 0, 0, 0.5);
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
  padding: var(--spacing-3);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  transition: all 0.2s;
  position: relative;
}

/* Scan line hover effect */
.service-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.1),
    transparent
  );
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-xs);
}

.service-item:hover::before {
  left: 100%;
}

.service-item:hover {
  border-color: rgba(0, 217, 255, 0.3);
  background: rgba(0, 217, 255, 0.05);
}

.service-color {
  flex-shrink: 0;
}

.service-name {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .settings {
    padding: var(--spacing-4) var(--spacing-3);
  }

  .settings-header {
    padding: var(--spacing-3);
  }

  .settings-header h1 {
    font-size: var(--text-xl);
  }

  .settings-section {
    padding: var(--spacing-4);
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }
}

/* Light Mode Adjustments */
:root[data-theme='light'] .settings-header {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.15),
              inset 0 0 20px rgba(0, 0, 0, 0.05);
}

:root[data-theme='light'] .settings-header h1 {
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
}

:root[data-theme='light'] .settings-section {
  background: rgba(255, 255, 255, 0.5);
}

:root[data-theme='light'] .settings::before {
  opacity: 0.3;
}

:root[data-theme='light'] .setting-select,
:root[data-theme='light'] .setting-checkbox {
  background: rgba(255, 255, 255, 0.5);
}
</style>
