<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <!-- Title -->
    <div v-if="data.title" class="mb-4">
      <h3 class="text-lg font-semibold">{{ data.title }}</h3>
    </div>

    <!-- Linear Progress -->
    <div v-if="variant === 'linear'" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span v-if="data.label" class="font-medium">{{ data.label }}</span>
        <span v-if="data.sublabel" class="text-muted-foreground">{{ data.sublabel }}</span>
        <span v-if="showPercentage && !data.indeterminate" class="text-muted-foreground">
          {{ Math.round((currentValue / data.max) * 100) }}%
        </span>
      </div>
      <div
        class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
        :class="sizeClasses[data.size ?? 'md']"
      >
        <div
          class="h-full transition-all duration-300 ease-in-out"
          :class="[
            colorClasses[data.color ?? 'primary'],
            data.indeterminate ? 'animate-pulse w-1/3 absolute' : ''
          ]"
          :style="data.indeterminate ? { left: indeterminatePosition + '%' } : { width: (currentValue / data.max) * 100 + '%' }"
        />
      </div>
    </div>

    <!-- Circular Progress -->
    <div v-if="variant === 'circular'" class="flex flex-col items-center gap-4">
      <div class="relative">
        <svg
          :class="circularSizeClasses[data.size ?? 'md']"
          viewBox="0 0 100 100"
        >
          <!-- Background circle -->
          <circle
            cx="50"
            cy="50"
            :r="radius"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            class="text-muted/20"
          />
          <!-- Progress circle -->
          <circle
            cx="50"
            cy="50"
            :r="radius"
            fill="none"
            :stroke="colorValue"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="data.indeterminate ? circumference * 0.7 : circumference - (currentValue / data.max) * circumference"
            :class="data.indeterminate ? 'animate-spin' : 'transition-all duration-300 ease-in-out'"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div
          v-if="showPercentage && !data.indeterminate"
          class="absolute inset-0 flex items-center justify-center"
        >
          <span class="text-2xl font-semibold">{{ Math.round((currentValue / data.max) * 100) }}%</span>
        </div>
      </div>
      <div class="text-center">
        <p v-if="data.label" class="font-medium">{{ data.label }}</p>
        <p v-if="data.sublabel" class="text-sm text-muted-foreground">{{ data.sublabel }}</p>
      </div>
    </div>

    <!-- Steps Progress -->
    <div v-if="variant === 'steps' || variant === 'vertical_steps'" class="space-y-4">
      <div v-if="data.label || data.sublabel" class="flex items-center justify-between">
        <span v-if="data.label" class="font-medium">{{ data.label }}</span>
        <span v-if="data.sublabel" class="text-sm text-muted-foreground">{{ data.sublabel }}</span>
      </div>
      <div
        :class="[
          'flex gap-2',
          variant === 'vertical_steps' ? 'flex-col' : 'flex-row'
        ]"
      >
        <button
          v-for="step in data.steps"
          :key="step.id"
          type="button"
          @click="handleStepClick(step.id)"
          :disabled="!data.clickable || step.status === 'skipped'"
          :class="[
            'flex items-center gap-3 rounded-lg border p-4 transition-all text-left',
            data.clickable && step.status !== 'skipped' ? 'cursor-pointer hover:bg-muted/50' : 'cursor-default',
            step.status === 'completed' ? 'border-primary bg-primary/5' : '',
            step.status === 'in_progress' ? 'border-primary ring-1 ring-primary' : '',
            step.status === 'error' ? 'border-destructive bg-destructive/5' : '',
            step.status === 'pending' || step.status === 'skipped' ? 'border-muted bg-muted/30 opacity-60' : ''
          ]"
        >
          <!-- Step icon -->
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
              step.status === 'completed' ? 'bg-primary text-primary-foreground' : '',
              step.status === 'in_progress' ? 'bg-primary/20 text-primary' : '',
              step.status === 'error' ? 'bg-destructive text-destructive-foreground' : '',
              step.status === 'pending' || step.status === 'skipped' ? 'bg-muted text-muted-foreground' : ''
            ]"
          >
            <span v-if="step.icon">{{ step.icon }}</span>
            <svg
              v-else-if="step.status === 'completed'"
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else-if="step.status === 'error'">!</span>
            <span v-else>{{ step.label.charAt(0).toUpperCase() }}</span>
          </div>

          <!-- Step content -->
          <div class="flex-1 min-w-0">
            <p class="font-medium">{{ step.label }}</p>
            <p v-if="step.description" class="text-sm text-muted-foreground">{{ step.description }}</p>
            <p v-if="step.status === 'error' && step.errorMessage" class="text-sm text-destructive mt-1">
              {{ step.errorMessage }}
            </p>
          </div>

          <!-- Arrow for horizontal -->
          <svg
            v-if="variant === 'steps'"
            class="h-4 w-4 text-muted-foreground shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProgressData, ProgressStep } from '@mcp-interactive-ui/types';

interface Props {
  data: ProgressData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const variant = computed(() => props.data.variant ?? 'linear');
const showPercentage = computed(() => props.data.showPercentage ?? true);

const currentValue = computed(() => {
  if (props.data.value !== undefined) return props.data.value;

  // Calculate from steps if no value provided
  if (props.data.steps) {
    const completedSteps = props.data.steps.filter((s) => s.status === 'completed').length;
    return (completedSteps / props.data.steps.length) * (props.data.max ?? 100);
  }

  return 0;
});

const indeterminatePosition = computed(() => {
  // Animate position for indeterminate state
  return ((Date.now() / 50) % 100) - 33;
});

const radius = 46;
const circumference = 2 * Math.PI * radius;

const sizeClasses: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const circularSizeClasses: Record<string, string> = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
};

const colorClasses: Record<string, string> = {
  default: 'bg-primary',
  primary: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-destructive',
};

const colorValue = computed(() => {
  const color = props.data.color ?? 'primary';
  switch (color) {
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

const handleStepClick = (stepId: string) => {
  if (!props.data.clickable) return;

  const step = props.data.steps?.find((s) => s.id === stepId);
  if (!step || step.status === 'skipped') return;

  emit('action', 'step_click', {
    stepId,
    stepLabel: step.label,
    stepStatus: step.status,
    timestamp: Date.now(),
  });
};
</script>
