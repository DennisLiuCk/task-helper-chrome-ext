<template>
  <div class="links">
    <div class="header">
      <h1>連結管理</h1>
      <Button variant="primary" size="md" @click="addNewLink">
        ➕ 新增連結
      </Button>
    </div>

    <!-- Jira Quick Links -->
    <section class="links-section">
      <h2 class="section-title">Jira 快速連結</h2>
      <div class="link-grid">
        <a
          :href="settingsStore.settings.jira.baseUrl"
          target="_blank"
          class="link-card"
          @click.prevent="openLink(settingsStore.settings.jira.baseUrl)"
        >
          <span class="link-icon">🎫</span>
          <div class="link-content">
            <div class="link-title">Jira Browse</div>
            <div class="link-url">{{ settingsStore.settings.jira.baseUrl }}</div>
          </div>
          <span class="link-external">↗</span>
        </a>

        <a
          :href="settingsStore.settings.jira.confluenceUrl"
          target="_blank"
          class="link-card"
          @click.prevent="openLink(settingsStore.settings.jira.confluenceUrl)"
        >
          <span class="link-icon">📚</span>
          <div class="link-content">
            <div class="link-title">Confluence</div>
            <div class="link-url">{{ settingsStore.settings.jira.confluenceUrl }}</div>
          </div>
          <span class="link-external">↗</span>
        </a>
      </div>
    </section>

    <!-- Custom Links -->
    <section class="links-section">
      <h2 class="section-title">自訂連結</h2>

      <div v-if="customLinks.length > 0" class="link-grid">
        <div
          v-for="(link, index) in customLinks"
          :key="index"
          class="link-card"
          @click="openLink(link.url)"
        >
          <span class="link-icon">{{ link.icon || '🔗' }}</span>
          <div class="link-content">
            <div class="link-title">{{ link.title }}</div>
            <div class="link-url">{{ link.url }}</div>
          </div>
          <div class="link-actions">
            <button
              class="link-action-btn"
              @click.stop="editLink(index)"
              title="編輯"
            >
              ✏️
            </button>
            <button
              class="link-action-btn"
              @click.stop="deleteLink(index)"
              title="刪除"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>還沒有自訂連結</p>
        <Button variant="secondary" size="sm" @click="addNewLink">
          新增第一個連結
        </Button>
      </div>
    </section>

    <!-- Link Form Modal -->
    <Modal :show="showLinkForm" @close="closeLinkForm">
      <div class="link-form">
        <h2 class="form-title">{{ editingIndex === null ? '新增' : '編輯' }}連結</h2>

        <div class="form-field">
          <label class="form-label">標題</label>
          <Input
            v-model="linkForm.title"
            placeholder="連結標題"
          />
        </div>

        <div class="form-field">
          <label class="form-label">URL</label>
          <Input
            v-model="linkForm.url"
            type="url"
            placeholder="https://example.com"
          />
        </div>

        <div class="form-field">
          <label class="form-label">圖標（emoji）</label>
          <Input
            v-model="linkForm.icon"
            placeholder="🔗"
            maxlength="2"
          />
        </div>

        <div class="form-actions">
          <Button variant="secondary" @click="closeLinkForm">
            取消
          </Button>
          <Button variant="primary" @click="saveLink">
            保存
          </Button>
        </div>
      </div>
    </Modal>

    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { STORAGE_KEYS } from '@/types/storage';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import Modal from '@/components/common/Modal.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';
import { useToast } from '@/composables/useToast';

interface CustomLink {
  title: string;
  url: string;
  icon?: string;
}

const settingsStore = useSettingsStore();
const { success, error } = useToast();

const customLinks = ref<CustomLink[]>([]);
const showLinkForm = ref(false);
const editingIndex = ref<number | null>(null);
const linkForm = ref<CustomLink>({
  title: '',
  url: '',
  icon: '🔗',
});

onMounted(async () => {
  await settingsStore.loadSettings();
  await loadCustomLinks();
});

async function loadCustomLinks() {
  try {
    const data = await chrome.storage.local.get([STORAGE_KEYS.CUSTOM_LINKS]);
    customLinks.value = data[STORAGE_KEYS.CUSTOM_LINKS] || [];
  } catch (err) {
    console.error('Failed to load custom links:', err);
  }
}

async function saveCustomLinks() {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEYS.CUSTOM_LINKS]: customLinks.value,
    });
  } catch (err) {
    error('保存連結失敗');
    throw err;
  }
}

function addNewLink() {
  editingIndex.value = null;
  linkForm.value = {
    title: '',
    url: '',
    icon: '🔗',
  };
  showLinkForm.value = true;
}

function editLink(index: number) {
  editingIndex.value = index;
  linkForm.value = { ...customLinks.value[index] };
  showLinkForm.value = true;
}

async function saveLink() {
  if (!linkForm.value.title || !linkForm.value.url) {
    error('請填寫標題和 URL');
    return;
  }

  try {
    if (editingIndex.value === null) {
      // Add new link
      customLinks.value.push({ ...linkForm.value });
      success('連結已新增');
    } else {
      // Update existing link
      customLinks.value[editingIndex.value] = { ...linkForm.value };
      success('連結已更新');
    }

    await saveCustomLinks();
    closeLinkForm();
  } catch (err) {
    console.error('Failed to save link:', err);
  }
}

async function deleteLink(index: number) {
  if (confirm('確定要刪除此連結嗎？')) {
    customLinks.value.splice(index, 1);
    await saveCustomLinks();
    success('連結已刪除');
  }
}

function closeLinkForm() {
  showLinkForm.value = false;
  editingIndex.value = null;
}

function openLink(url: string) {
  if (url) {
    window.open(url, '_blank');
  }
}
</script>

<style scoped>
.links {
  padding: var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.header h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.links-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-4) 0;
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--border);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-3);
}

.link-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: var(--transition-colors);
}

.link-card:hover {
  border-color: var(--primary-400);
  background: var(--surface);
}

.link-icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

.link-content {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}

.link-url {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-external {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.link-actions {
  display: flex;
  gap: var(--spacing-1);
  flex-shrink: 0;
}

.link-action-btn {
  background: none;
  border: none;
  padding: var(--spacing-1);
  cursor: pointer;
  font-size: var(--text-base);
  opacity: 0.6;
  transition: opacity 0.2s;
}

.link-action-btn:hover {
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
}

.empty-state p {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-4) 0;
}

/* Link Form Modal */
.link-form {
  padding: var(--spacing-6);
}

.form-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-6) 0;
}

.form-field {
  margin-bottom: var(--spacing-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
  margin-top: var(--spacing-6);
}
</style>
