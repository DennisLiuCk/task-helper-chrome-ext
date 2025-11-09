import { createRouter, createMemoryHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/Tasks.vue'),
  },
  {
    path: '/releases',
    name: 'Releases',
    component: () => import('@/views/Releases.vue'),
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('@/views/Links.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
