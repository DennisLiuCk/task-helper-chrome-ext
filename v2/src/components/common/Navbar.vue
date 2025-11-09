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
          <span class="nav-item__icon">{{ item.icon }}</span>
          <span class="nav-item__label">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const route = useRoute();

const navItems: NavItem[] = [
  { path: '/dashboard', label: '儀表板', icon: '📊' },
  { path: '/tasks', label: '任務', icon: '✅' },
  { path: '/releases', label: '發布', icon: '🚀' },
  { path: '/links', label: '連結', icon: '🔗' },
  { path: '/settings', label: '設定', icon: '⚙️' },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  gap: var(--spacing-4);
}

.navbar__brand {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
}

.navbar__title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--primary-500);
}

.navbar__version {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.navbar__nav {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-colors);
  cursor: pointer;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--primary-100);
  color: var(--primary-700);
}

.nav-item--active {
  background: var(--primary-500);
  color: white;
}

.nav-item--active:hover {
  background: var(--primary-600);
  color: white;
}

.nav-item__icon {
  font-size: var(--text-base);
  line-height: 1;
}

.nav-item__label {
  font-size: var(--text-sm);
}

/* Responsive for smaller popup width */
@media (max-width: 600px) {
  .navbar__container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-3);
  }

  .navbar__brand {
    justify-content: center;
  }

  .navbar__nav {
    justify-content: center;
  }

  .nav-item {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  .nav-item__label {
    display: none;
  }

  .nav-item__icon {
    font-size: var(--text-lg);
  }
}
</style>
