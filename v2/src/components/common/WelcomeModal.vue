<template>
  <Modal :show="show" size="lg" @close="handleClose">
    <div class="welcome-modal">
      <div class="welcome-header">
        <h2 class="welcome-title">歡迎使用 Task Helper v2</h2>
        <p class="welcome-subtitle">現代化的 Jira 任務管理工具</p>
      </div>

      <div class="welcome-content">
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <div class="feature-text">
              <h3>任務管理</h3>
              <p>完整的任務 CRUD，支持狀態追蹤和優先度管理</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">🔍</span>
            <div class="feature-text">
              <h3>快速搜尋</h3>
              <p>使用 Cmd+K 快速搜尋和導航任務</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <div class="feature-text">
              <h3>數據統計</h3>
              <p>實時追蹤任務狀態和進度</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <div class="feature-text">
              <h3>自訂主題</h3>
              <p>淺色/深色主題，支持自動切換</p>
            </div>
          </div>
        </div>

        <div class="welcome-actions">
          <div class="action-card">
            <h3>想要快速上手？</h3>
            <p>我們可以為您創建一些範例任務，幫助您了解功能。</p>
            <Button variant="primary" @click="handleLoadSample">
              載入範例數據
            </Button>
          </div>

          <div class="action-card">
            <h3>直接開始</h3>
            <p>跳過範例，立即開始創建您的第一個任務。</p>
            <Button variant="secondary" @click="handleSkip">
              開始使用
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import Button from './Button.vue';

interface Props {
  show: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'load-sample'): void;
  (e: 'skip'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function handleClose() {
  emit('close');
}

function handleLoadSample() {
  emit('load-sample');
  emit('close');
}

function handleSkip() {
  emit('skip');
  emit('close');
}
</script>

<style scoped>
.welcome-modal {
  padding: var(--spacing-6);
}

.welcome-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.welcome-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary-500);
  margin: 0 0 var(--spacing-2) 0;
}

.welcome-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.feature-item {
  display: flex;
  gap: var(--spacing-3);
  align-items: start;
}

.feature-icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-1) 0;
}

.feature-text p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

.welcome-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.action-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.action-card h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.action-card p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
}

/* Responsive */
@media (max-width: 600px) {
  .feature-list {
    grid-template-columns: 1fr;
  }

  .welcome-actions {
    grid-template-columns: 1fr;
  }
}
</style>
