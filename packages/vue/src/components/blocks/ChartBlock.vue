<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div v-if="data.title || data.description" class="p-6 pb-4">
      <h3 v-if="data.title" class="text-lg font-semibold">{{ data.title }}</h3>
      <p v-if="data.description" class="text-sm text-muted-foreground">{{ data.description }}</p>
    </div>

    <div class="p-6 pt-0">
      <!-- SVG-based chart implementation matching shadcn chart styling -->
      <div :style="{ height: (data.options?.height ?? 300) + 'px' }">
        <!-- Bar Chart -->
        <svg v-if="data.type === 'bar'" class="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <!-- Grid lines -->
          <g v-if="data.options?.grid !== false">
            <line
              v-for="i in 5"
              :key="i"
              x1="60"
              :y1="250 - (i - 1) * 50"
              x2="780"
              :y2="250 - (i - 1) * 50"
              stroke="currentColor"
              stroke-width="1"
              class="text-muted/20"
            />
          </g>

          <!-- Bars -->
          <g v-for="(dataset, dIdx) in data.data.datasets" :key="dIdx">
            <rect
              v-for="(value, i) in dataset.data"
              :key="i"
              :x="60 + (i * (720 / data.data.labels.length)) + (dIdx * (720 / data.data.labels.length / data.data.datasets.length)) + 10"
              :y="250 - (value / maxValue) * 200"
              :width="(720 / data.data.labels.length / data.data.datasets.length) - 5"
              :height="(value / maxValue) * 200"
              :fill="dataset.color || defaultColors[dIdx % defaultColors.length]"
              rx="4"
              class="transition-all duration-300"
            />
          </g>

          <!-- X-axis labels -->
          <text
            v-for="(label, i) in data.data.labels"
            :key="i"
            :x="60 + (i * (720 / data.data.labels.length)) + (720 / data.data.labels.length / 2)"
            y="280"
            text-anchor="middle"
            class="text-xs fill-muted-foreground"
          >
            {{ label }}
          </text>
        </svg>

        <!-- Line Chart -->
        <svg v-if="data.type === 'line' || data.type === 'area'" class="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <!-- Grid lines -->
          <g v-if="data.options?.grid !== false">
            <line
              v-for="i in 5"
              :key="i"
              x1="60"
              :y1="250 - (i - 1) * 50"
              x2="780"
              :y2="250 - (i - 1) * 50"
              stroke="currentColor"
              stroke-width="1"
              class="text-muted/20"
            />
          </g>

          <!-- Area fill -->
          <g v-if="data.type === 'area'">
            <polygon
              v-for="(dataset, dIdx) in data.data.datasets"
              :key="`area-${dIdx}`"
              :points="getAreaPoints(dataset.data)"
              :fill="dataset.color || defaultColors[dIdx % defaultColors.length]"
              opacity="0.2"
            />
          </g>

          <!-- Lines -->
          <g v-for="(dataset, dIdx) in data.data.datasets" :key="dIdx">
            <polyline
              :points="getLinePoints(dataset.data)"
              fill="none"
              :stroke="dataset.color || defaultColors[dIdx % defaultColors.length]"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Data points -->
            <circle
              v-for="(value, i) in dataset.data"
              :key="i"
              :cx="60 + (i * (720 / (dataset.data.length - 1)))"
              :cy="250 - (value / maxValue) * 200"
              r="5"
              :fill="dataset.color || defaultColors[dIdx % defaultColors.length]"
            />
          </g>

          <!-- X-axis labels -->
          <text
            v-for="(label, i) in data.data.labels"
            :key="i"
            :x="60 + (i * (720 / (data.data.labels.length - 1)))"
            y="280"
            text-anchor="middle"
            class="text-xs fill-muted-foreground"
          >
            {{ label }}
          </text>
        </svg>

        <!-- Pie/Doughnut Chart -->
        <svg v-if="data.type === 'pie' || data.type === 'doughnut'" class="w-full h-full" viewBox="0 0 400 300">
          <g transform="translate(200, 150)">
            <g v-for="(slice, i) in pieSlices" :key="i">
              <path
                :d="slice.path"
                :fill="slice.color"
                stroke="white"
                stroke-width="2"
              />
            </g>
            <!-- Doughnut hole -->
            <circle
              v-if="data.type === 'doughnut'"
              cx="0"
              cy="0"
              r="60"
              fill="hsl(var(--card))"
            />
          </g>

          <!-- Legend -->
          <g transform="translate(320, 50)">
            <g
              v-for="(dataset, dIdx) in data.data.datasets"
              :key="dIdx"
              :transform="`translate(0, ${dIdx * 25})`"
            >
              <rect
                v-for="(value, i) in dataset.data"
                :key="i"
                x="0"
                :y="i * 20"
                width="12"
                height="12"
                :fill="dataset.color || defaultColors[i % defaultColors.length]"
                rx="2"
              />
              <text
                v-for="(label, i) in data.data.labels"
                :key="`label-${i}`"
                x="18"
                :y="i * 20 + 10"
                class="text-xs fill-muted-foreground"
              >
                {{ label }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Fallback for unsupported chart types -->
        <div v-if="!['bar', 'line', 'area', 'pie', 'doughnut'].includes(data.type)" class="flex items-center justify-center h-full text-muted-foreground">
          Chart type "{{ data.type }}" preview not available
        </div>
      </div>

      <!-- Legend -->
      <div v-if="data.options?.legend !== false && data.data.datasets.length > 1" class="mt-4 flex flex-wrap gap-4 justify-center">
        <div
          v-for="(dataset, i) in data.data.datasets"
          :key="i"
          class="flex items-center gap-2"
        >
          <div
            class="w-3 h-3 rounded-sm"
            :style="{ backgroundColor: dataset.color || defaultColors[i % defaultColors.length] }"
          />
          <span class="text-sm text-muted-foreground">{{ dataset.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChartData } from '@mcp-interactive-ui/types';

interface Props {
  data: ChartData;
  blockId?: string;
}

const props = defineProps<Props>();

const defaultColors = [
  'hsl(var(--primary))',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#8b5cf6',
];

const maxValue = computed(() => {
  let max = 0;
  props.data.data.datasets.forEach((dataset) => {
    dataset.data.forEach((value) => {
      if (value > max) max = value;
    });
  });
  return max || 1;
});

const getLinePoints = (data: number[]) => {
  return data
    .map((value, i) => {
      const x = 60 + (i * (720 / (data.length - 1)));
      const y = 250 - (value / maxValue.value) * 200;
      return `${x},${y}`;
    })
    .join(' ');
};

const getAreaPoints = (data: number[]) => {
  const points = data.map((value, i) => {
    const x = 60 + (i * (720 / (data.length - 1)));
    const y = 250 - (value / maxValue.value) * 200;
    return `${x},${y}`;
  });
  return `60,250 ${points.join(' ')} 780,250`;
};

const pieSlices = computed(() => {
  const dataset = props.data.data.datasets[0];
  if (!dataset) return [];

  const total = dataset.data.reduce((sum, val) => sum + val, 0);
  let currentAngle = 0;

  return dataset.data.map((value, i) => {
    const angle = (value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const largeArc = angle > Math.PI ? 1 : 0;
    const outerRadius = props.data.type === 'doughnut' ? 100 : 120;

    const x1 = Math.cos(startAngle - Math.PI / 2) * outerRadius;
    const y1 = Math.sin(startAngle - Math.PI / 2) * outerRadius;
    const x2 = Math.cos(endAngle - Math.PI / 2) * outerRadius;
    const y2 = Math.sin(endAngle - Math.PI / 2) * outerRadius;

    const path = `M 0,0 L ${x1},${y1} A ${outerRadius},${outerRadius} 0 ${largeArc},1 ${x2},${y2} Z`;

    return {
      path,
      color: dataset.color || defaultColors[i % defaultColors.length],
      value,
      label: props.data.data.labels[i],
    };
  });
});
</script>
