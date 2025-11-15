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
/* ═══════════════════════════════════════════════════════════
   CYBER WELCOME MODAL - System Initialization
   ═══════════════════════════════════════════════════════════ */

.welcome-modal {
  padding: var(--spacing-6);
}

.welcome-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
  position: relative;
}

.welcome-title {
  font-size: var(--text-2xl);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-400);
  margin: 0 0 var(--spacing-2) 0;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
}

.welcome-subtitle {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin: 0;
  letter-spacing: 0.03em;
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
  padding: var(--spacing-3);
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  transition: all 0.2s;
}

.feature-item:hover {
  border-color: rgba(0, 217, 255, 0.3);
  background: rgba(0, 217, 255, 0.05);
}

.feature-icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
  filter: drop-shadow(0 0 5px rgba(0, 217, 255, 0.4));
}

.feature-text h3 {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary-400);
  margin: 0 0 var(--spacing-1) 0;
}

.feature-text p {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.welcome-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.action-card {
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(0, 217, 255, 0.2);
  border-radius: var(--radius-sm);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-card::before {
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
  transition: left 0.5s;
}

.action-card:hover::before {
  left: 100%;
}

.action-card:hover {
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.3),
              inset 0 0 15px rgba(0, 217, 255, 0.05);
  transform: translateY(-2px);
}

.action-card h3 {
  font-size: var(--text-base);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-primary);
  margin: 0;
}

.action-card p {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
  line-height: 1.6;
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

/* Light Mode Adjustments */
:root[data-theme='light'] .welcome-title {
  text-shadow: none;
}

:root[data-theme='light'] .action-card {
  background: rgba(255, 255, 255, 0.5);
}

:root[data-theme='light'] .action-card:hover {
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.2);
}
</style>
