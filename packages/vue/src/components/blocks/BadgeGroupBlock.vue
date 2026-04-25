<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 v-if="data.title" class="text-lg font-semibold mb-4">{{ data.title }}</h3>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="(badge, index) in data.badges"
        :key="index"
        :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
          variantClasses[badge.variant ?? 'default'],
          sizeClasses[data.size ?? 'md'],
          badge.onClick ? 'cursor-pointer hover:opacity-80' : ''
        ]"
        @click="handleClick(badge, index)"
      >
        <span v-if="badge.icon" class="mr-1">{{ badge.icon }}</span>
        {{ badge.label }}
        <button
          v-if="badge.removable"
          type="button"
          @click.stop="removeBadge(index)"
          class="ml-1 -mr-1 h-3 w-3 rounded-full inline-flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10"
        >
          <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>

    <p v-if="data.description" class="mt-4 text-sm text-muted-foreground">{{ data.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BadgeGroupData } from '@mcp-interactive-ui/types';

interface Props {
  data: BadgeGroupData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const badges = ref([...props.data.badges]);

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-green-500/10 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  error: 'bg-destructive/10 text-destructive',
  outline: 'border border-input bg-background text-foreground',
};

const sizeClasses: Record<string, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1',
};

const handleClick = (badge: typeof badges.value[0], index: number) => {
  if (badge.onClick) {
    emit('action', 'badge_click', {
      index,
      label: badge.label,
      value: badge.value,
    });
  }
};

const removeBadge = (index: number) => {
  const removed = badges.value[index];
  badges.value.splice(index, 1);
  emit('action', 'badge_remove', {
    index,
    label: removed.label,
    value: removed.value,
  });
};
</script>
