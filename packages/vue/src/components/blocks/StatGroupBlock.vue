<template>
  <div class="grid gap-4" :class="gridColsClass">
    <div
      v-for="stat in data.stats"
      :key="stat.label"
      class="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
    >
      <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
      <div class="mt-2 flex items-baseline gap-2">
        <span class="text-3xl font-bold tracking-tight">{{ stat.value }}</span>
        <span
          v-if="stat.change"
          :class="[
            'text-sm font-medium',
            stat.changeType === 'positive' ? 'text-green-600' : '',
            stat.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
          ]"
        >
          {{ stat.changeType === 'positive' ? '+' : stat.changeType === 'negative' ? '' : '' }}{{ stat.change }}
        </span>
      </div>
      <p v-if="stat.description" class="mt-1 text-xs text-muted-foreground">{{ stat.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { StatGroupData } from '@mcp-interactive-ui/types';

interface Props {
  data: StatGroupData;
  blockId?: string;
}

const props = defineProps<Props>();

const gridColsClass = computed(() => {
  const count = props.data.stats?.length ?? 1;
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  if (count === 3) return 'grid-cols-1 md:grid-cols-3';
  if (count === 4) return 'grid-cols-2 md:grid-cols-4';
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
});
</script>
