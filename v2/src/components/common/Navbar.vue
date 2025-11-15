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
/* ═══════════════════════════════════════════════════════════
   CYBER NAVBAR - Command Terminal Navigation
   ═══════════════════════════════════════════════════════════ */

.navbar {
  background: linear-gradient(
    180deg,
    var(--surface),
    var(--surface-variant)
  );
  border-bottom: 2px solid var(--primary-500);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;
}

/* Neon underline effect */
.navbar::after {
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
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.8);
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  gap: var(--spacing-4);
  position: relative;
  z-index: 1;
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
  color: var(--primary-500);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
}

.navbar__version {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  font-weight: var(--font-semibold);
  padding: 2px var(--spacing-1);
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: var(--radius-sm);
}

.navbar__nav {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

/* Scan line effect on hover */
.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.15),
    transparent
  );
  transition: left 0.4s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: rgba(0, 217, 255, 0.08);
  border-color: rgba(0, 217, 255, 0.3);
  color: var(--primary-400);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
  transform: translateY(-1px);
}

/* Active state - Neon highlight */
.nav-item--active {
  background: rgba(0, 217, 255, 0.15);
  border-color: var(--primary-500);
  color: var(--primary-400);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.5),
              inset 0 0 15px rgba(0, 217, 255, 0.1);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

/* Active underline indicator */
.nav-item--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-500);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

.nav-item--active:hover {
  background: rgba(0, 217, 255, 0.2);
  border-color: var(--primary-400);
  color: var(--primary-300);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.6),
              inset 0 0 20px rgba(0, 217, 255, 0.15);
}

.nav-item__icon {
  font-size: var(--text-base);
  line-height: 1;
  filter: drop-shadow(0 0 3px rgba(0, 217, 255, 0.5));
}

.nav-item__label {
  font-size: 10px;
  font-weight: var(--font-bold);
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
    padding-bottom: var(--spacing-2);
    border-bottom: 1px solid rgba(0, 217, 255, 0.2);
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

  .nav-item--active::after {
    bottom: 0;
    left: 50%;
    right: auto;
    width: 60%;
    transform: translateX(-50%);
  }
}

/* Light mode adjustments */
:root[data-theme='light'] .navbar {
  background: linear-gradient(
    180deg,
    white,
    var(--surface-variant)
  );
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.2),
              0 4px 12px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .nav-item--active {
  background: rgba(0, 217, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 217, 255, 0.08);
}
</style>
