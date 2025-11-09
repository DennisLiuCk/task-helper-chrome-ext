import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Settings } from '@/types';
import { defaultSettings } from '@/types/settings';
import { STORAGE_KEYS } from '@/types/storage';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({ ...defaultSettings });
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadSettings() {
    loading.value = true;
    try {
      const data = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
      if (data[STORAGE_KEYS.SETTINGS]) {
        settings.value = {
          ...defaultSettings,
          ...data[STORAGE_KEYS.SETTINGS],
        };
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load settings';
      console.error('Failed to load settings:', err);
    } finally {
      loading.value = false;
    }
  }

  async function saveSettings() {
    loading.value = true;
    try {
      await chrome.storage.local.set({
        [STORAGE_KEYS.SETTINGS]: settings.value,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save settings';
      console.error('Failed to save settings:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateSettings(updates: Partial<Settings>) {
    settings.value = {
      ...settings.value,
      ...updates,
    };
    await saveSettings();
  }

  async function resetSettings() {
    settings.value = { ...defaultSettings };
    await saveSettings();
  }

  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings,
    updateSettings,
    resetSettings,
  };
});
