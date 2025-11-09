import type { Task } from './task';
import type { ReleaseGroup } from './release';
import type { Settings } from './settings';

export interface StorageData {
  tasks: Task[];
  releases: ReleaseGroup[];
  settings: Settings;
  history: string[]; // Task IDs
}

export interface StorageKeys {
  TASKS: 'tasks';
  RELEASES: 'releases';
  SETTINGS: 'settings';
  HISTORY: 'history';
}

export const STORAGE_KEYS: StorageKeys = {
  TASKS: 'tasks',
  RELEASES: 'releases',
  SETTINGS: 'settings',
  HISTORY: 'history',
};
