<template>
  <div id="app" class="app-container">
    <Navbar />
    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import Navbar from '@/components/common/Navbar.vue';

const settingsStore = useSettingsStore();

onMounted(async () => {
  // Load settings from Chrome Storage
  await settingsStore.loadSettings();

  // Apply theme
  applyTheme();
});

function applyTheme() {
  const theme = settingsStore.settings.ui.theme;

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 600px;
  background: var(--background);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  overflow-y: auto;
}
</style>
