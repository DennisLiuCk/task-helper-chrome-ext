<template>
  <nav class="navbar">
    <div class="navbar__container">
      <div class="navbar__brand">
        <span class="navbar__title">Task Helper</span>
        <span class="navbar__version">v2.0</span>
      </div>

      <div class="navbar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.path) }"
        >
          <Icon :name="item.icon" size="sm" class="nav-item__icon" />
          <span class="nav-item__label">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Icon from './Icon.vue';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const route = useRoute();

const navItems: NavItem[] = [
  { path: '/dashboard', label: '儀表板', icon: 'dashboard' },
  { path: '/tasks', label: '任務', icon: 'tasks' },
  { path: '/releases', label: '發布', icon: 'release' },
  { path: '/links', label: '連結', icon: 'link' },
  { path: '/settings', label: '設定', icon: 'settings' },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   MODERN NAVBAR - Clean Professional Navigation
   ═══════════════════════════════════════════════════════════ */

.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(8px);
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  gap: var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
}

.navbar__brand {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
}

.navbar__title {
  font-size: var(--text-lg);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.navbar__version {
  font-size: var(--text-xs);
  font-family: var(--font-sans);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  padding: 2px var(--spacing-2);
  background: var(--surface-variant);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
}

.navbar__nav {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-sans);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s var(--ease-out);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

/* Active state - Clean highlight */
.nav-item--active {
  background: var(--primary-alpha-10);
  color: var(--primary-600);
  font-weight: var(--font-semibold);
}

.nav-item--active .nav-item__icon {
  color: var(--primary-600);
}

.nav-item--active:hover {
  background: var(--primary-alpha-20);
  color: var(--primary-700);
}

.nav-item__icon {
  color: currentColor;
  transition: color 0.2s var(--ease-out);
}

.nav-item__label {
  font-size: var(--text-sm);
  font-weight: inherit;
}

/* Responsive for smaller popup width */
@media (max-width: 600px) {
  .navbar__container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-3);
    padding: var(--spacing-2) var(--spacing-3);
  }

  .navbar__brand {
    justify-content: center;
    padding-bottom: var(--spacing-2);
    border-bottom: 1px solid var(--border);
  }

  .navbar__nav {
    justify-content: center;
  }

  .nav-item {
    flex: 1;
    justify-content: center;
    min-width: 0;
    padding: var(--spacing-2);
  }

  .nav-item__label {
    display: none;
  }
}

/* Dark mode adjustments */
:root[data-theme='dark'] .navbar {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
}

:root[data-theme='dark'] .nav-item--active {
  background: rgba(139, 92, 246, 0.15);
  color: var(--primary-400);
}

:root[data-theme='dark'] .nav-item--active .nav-item__icon {
  color: var(--primary-400);
}
</style>
