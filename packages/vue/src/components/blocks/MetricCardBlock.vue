<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ data.label }}</p>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-bold tracking-tight">{{ data.value }}</span>
          <span
            v-if="data.unit"
            class="text-lg text-muted-foreground"
          >
            {{ data.unit }}
          </span>
        </div>
        <div v-if="data.change || data.context" class="mt-1 flex items-center gap-2">
          <span
            v-if="data.change"
            :class="[
              'text-sm font-medium',
              data.changeType === 'positive' ? 'text-green-600' : '',
              data.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
            ]"
          >
            <span v-if="data.changeType === 'positive'">↑</span>
            <span v-else-if="data.changeType === 'negative'">↓</span>
            {{ data.change }}
          </span>
          <span v-if="data.context" class="text-sm text-muted-foreground">
            {{ data.context }}
          </span>
        </div>
      </div>

      <!-- Icon -->
      <div
        v-if="data.icon"
        :class="[
          'p-3 rounded-lg',
          iconBgClasses[data.iconColor ?? 'default']
        ]"
      >
        <span class="text-2xl">{{ data.icon }}</span>
      </div>
    </div>

    <!-- Trend sparkline (simple visual) -->
    <div v-if="data.trend" class="mt-4">
      <svg class="w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none">
        <polyline
          :points="getTrendPoints(data.trend)"
          fill="none"
          :stroke="trendColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MetricCardData } from '@mcp-interactive-ui/types';

interface Props {
  data: MetricCardData;
  blockId?: string;
}

const props = defineProps<Props>();

const iconBgClasses: Record<string, string> = {
  default: 'bg-muted',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-500/10 text-green-600',
  warning: 'bg-yellow-500/10 text-yellow-600',
  error: 'bg-destructive/10 text-destructive',
};

const trendColor = computed(() => {
  switch (props.data.iconColor) {
    case 'success':
      return '#22c55e';
    case 'warning':
      return '#eab308';
    case 'error':
      return 'hsl(var(--destructive))';
    default:
      return 'hsl(var(--primary))';
  }
});

const getTrendPoints = (trend: number[]) => {
  if (!trend.length) return '';

  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;

  return trend
    .map((value, index) => {
      const x = (index / (trend.length - 1)) * 100;
      const y = 20 - ((value - min) / range) * 16 - 2; // Leave some padding
      return `${x},${y}`;
    })
    .join(' ');
};
</script>
