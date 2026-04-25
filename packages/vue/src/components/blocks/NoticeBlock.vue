<template>
  <div
    class="rounded-lg border p-4"
    :class="variantClasses[data.variant || 'default']"
  >
    <div class="flex items-start gap-4">
      <span v-if="data.icon" class="text-lg shrink-0">{{ data.icon }}</span>
      <div class="flex-1">
        <h4 v-if="data.title" class="font-semibold mb-1">{{ data.title }}</h4>
        <p class="text-sm">{{ data.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NoticeData } from '@mcp-interactive-ui/types';

interface Props {
  data: NoticeData;
  blockId?: string;
}

defineProps<Props>();

const variantClasses: Record<string, string> = {
  default: 'bg-muted border-border',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
};
</script>
