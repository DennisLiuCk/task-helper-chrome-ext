import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, TaskStatus, TaskStats } from '@/types';
import { STORAGE_KEYS } from '@/types/storage';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref(new Map<string, Task>());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const allTasks = computed(() => Array.from(tasks.value.values()));

  const tasksByStatus = computed(() => (status: TaskStatus) => {
    return allTasks.value.filter((task) => task.status === status);
  });

  const tasksByService = computed(() => (service: string) => {
    return allTasks.value.filter((task) => task.service === service);
  });

  const pinnedTasks = computed(() => {
    return allTasks.value
      .filter((task) => task.isPinned)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  });

  const recentTasks = computed(() => {
    return allTasks.value
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);
  });

  const statistics = computed((): TaskStats => {
    const taskArray = allTasks.value;
    return {
      total: taskArray.length,
      byStatus: {
        NA: taskArray.filter((t) => t.status === 'NA').length,
        DEV: taskArray.filter((t) => t.status === 'DEV').length,
        QA: taskArray.filter((t) => t.status === 'QA').length,
        UAT: taskArray.filter((t) => t.status === 'UAT').length,
        DONE: taskArray.filter((t) => t.status === 'DONE').length,
        BLOCKED: taskArray.filter((t) => t.status === 'BLOCKED').length,
      },
      byService: {},
      byPriority: {
        LOW: taskArray.filter((t) => t.priority === 'LOW').length,
        MEDIUM: taskArray.filter((t) => t.priority === 'MEDIUM').length,
        HIGH: taskArray.filter((t) => t.priority === 'HIGH').length,
        CRITICAL: taskArray.filter((t) => t.priority === 'CRITICAL').length,
      },
    };
  });

  // Actions
  async function loadTasks() {
    loading.value = true;
    try {
      const data = await chrome.storage.local.get([STORAGE_KEYS.TASKS]);
      const taskArray: Task[] = data[STORAGE_KEYS.TASKS] || [];
      tasks.value = new Map(taskArray.map((t) => [t.id, t]));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tasks';
      console.error('Failed to load tasks:', err);
    } finally {
      loading.value = false;
    }
  }

  async function saveTasks() {
    try {
      const taskArray = Array.from(tasks.value.values());
      await chrome.storage.local.set({
        [STORAGE_KEYS.TASKS]: taskArray,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save tasks';
      console.error('Failed to save tasks:', err);
      throw err;
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...task,
      id: task.prefix + task.number,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    tasks.value.set(newTask.id, newTask);
    await saveTasks();
    return newTask;
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const task = tasks.value.get(id);
    if (!task) return;

    const updated = {
      ...task,
      ...updates,
      updatedAt: Date.now(),
    };
    tasks.value.set(id, updated);
    await saveTasks();
    return updated;
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    return updateTask(id, {
      status,
      ...(status === 'DONE' && { completedAt: Date.now() }),
    });
  }

  async function deleteTask(id: string) {
    tasks.value.delete(id);
    await saveTasks();
  }

  async function batchUpdateStatus(ids: string[], status: TaskStatus) {
    ids.forEach((id) => {
      const task = tasks.value.get(id);
      if (task) {
        tasks.value.set(id, {
          ...task,
          status,
          updatedAt: Date.now(),
          ...(status === 'DONE' && { completedAt: Date.now() }),
        });
      }
    });
    await saveTasks();
  }

  async function togglePin(id: string) {
    const task = tasks.value.get(id);
    if (task) {
      return updateTask(id, { isPinned: !task.isPinned });
    }
  }

  async function toggleStar(id: string) {
    const task = tasks.value.get(id);
    if (task) {
      return updateTask(id, { isStarred: !task.isStarred });
    }
  }

  return {
    tasks,
    loading,
    error,
    allTasks,
    tasksByStatus,
    tasksByService,
    pinnedTasks,
    recentTasks,
    statistics,
    loadTasks,
    saveTasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    batchUpdateStatus,
    togglePin,
    toggleStar,
  };
});
