<template>
  <svg
    :class="['icon', `icon--${size}`]"
    :width="sizeMap[size]"
    :height="sizeMap[size]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <component :is="iconComponent" />
  </svg>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';

interface Props {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40
};

// Icon definitions using Heroicons-style paths
const icons = {
  // Navigation
  dashboard: defineComponent({
    setup() {
      return () => h('g', [
        h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' })
      ]);
    }
  }),

  tasks: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }),
        h('path', { d: 'M9 12l2 2 4-4' })
      ]);
    }
  }),

  release: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
      ]);
    }
  }),

  link: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' })
      ]);
    }
  }),

  settings: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
        h('path', { d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
      ]);
    }
  }),

  // Actions
  plus: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M12 5v14M5 12h14' })
      ]);
    }
  }),

  search: defineComponent({
    setup() {
      return () => h('g', [
        h('circle', { cx: '11', cy: '11', r: '8' }),
        h('path', { d: 'm21 21-4.35-4.35' })
      ]);
    }
  }),

  filter: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' })
      ]);
    }
  }),

  edit: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7' }),
        h('path', { d: 'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' })
      ]);
    }
  }),

  trash: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
      ]);
    }
  }),

  // Status
  check: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M5 13l4 4L19 7' })
      ]);
    }
  }),

  x: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M6 18L18 6M6 6l12 12' })
      ]);
    }
  }),

  info: defineComponent({
    setup() {
      return () => h('g', [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('path', { d: 'M12 16v-4M12 8h.01' })
      ]);
    }
  }),

  // Other
  star: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' })
      ]);
    }
  }),

  pin: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' })
      ]);
    }
  }),

  chevronDown: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'm6 9 6 6 6-6' })
      ]);
    }
  }),

  chevronRight: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'm9 18 6-6-6-6' })
      ]);
    }
  }),

  grid: defineComponent({
    setup() {
      return () => h('g', [
        h('rect', { x: '3', y: '3', width: '7', height: '7' }),
        h('rect', { x: '14', y: '3', width: '7', height: '7' }),
        h('rect', { x: '14', y: '14', width: '7', height: '7' }),
        h('rect', { x: '3', y: '14', width: '7', height: '7' })
      ]);
    }
  }),

  list: defineComponent({
    setup() {
      return () => h('g', [
        h('path', { d: 'M4 6h16M4 12h16M4 18h16' })
      ]);
    }
  }),

  moreVertical: defineComponent({
    setup() {
      return () => h('g', [
        h('circle', { cx: '12', cy: '12', r: '1' }),
        h('circle', { cx: '12', cy: '5', r: '1' }),
        h('circle', { cx: '12', cy: '19', r: '1' })
      ]);
    }
  }),

  clock: defineComponent({
    setup() {
      return () => h('g', [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('path', { d: 'M12 6v6l4 2' })
      ]);
    }
  }),
};

const iconComponent = computed(() => {
  return icons[props.name as keyof typeof icons] || icons.info;
});
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.icon--xs {
  width: 16px;
  height: 16px;
}

.icon--sm {
  width: 20px;
  height: 20px;
}

.icon--md {
  width: 24px;
  height: 24px;
}

.icon--lg {
  width: 32px;
  height: 32px;
}

.icon--xl {
  width: 40px;
  height: 40px;
}
</style>
