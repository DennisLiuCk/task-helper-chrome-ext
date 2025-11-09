import type { Task } from './task';
import type { ReleaseGroup } from './release';
import type { Settings } from './settings';

export interface CustomLink {
  title: string;
  url: string;
  icon?: string;
}

export interface StorageData {
  tasks: Task[];
  releases: ReleaseGroup[];
  settings: Settings;
  history: string[]; // Task IDs
  customLinks: CustomLink[];
}

export interface StorageKeys {
  TASKS: 'tasks';
  RELEASES: 'releases';
  SETTINGS: 'settings';
  HISTORY: 'history';
  CUSTOM_LINKS: 'customLinks';
}

export const STORAGE_KEYS: StorageKeys = {
  TASKS: 'tasks',
  RELEASES: 'releases',
  SETTINGS: 'settings',
  HISTORY: 'history',
  CUSTOM_LINKS: 'customLinks',
};
