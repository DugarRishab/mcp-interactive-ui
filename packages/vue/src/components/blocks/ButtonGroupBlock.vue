<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <!-- Title and description -->
    <div v-if="data.title || data.description" class="mb-4 space-y-1">
      <h3 v-if="data.title" class="text-lg font-semibold">{{ data.title }}</h3>
      <p v-if="data.description" class="text-sm text-muted-foreground">{{ data.description }}</p>
    </div>

    <!-- Button group -->
    <div :class="[layoutClass, alignClass]">
      <button
        v-for="button in data.actions"
        :key="button.id"
        type="button"
        :disabled="button.disabled || loadingButtons.has(button.id)"
        @click="handleButtonClick(button)"
        :class="[
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[button.variant ?? 'secondary'],
          buttonSizes[button.size ?? data.size ?? 'md'],
          data.align === 'stretch' && data.layout === 'vertical' ? 'w-full' : ''
        ]"
      >
        <!-- Loading spinner -->
        <svg
          v-if="loadingButtons.has(button.id)"
          class="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        <!-- Icon (placeholder - would use lucide-vue in real implementation) -->
        <span v-if="button.icon && button.iconPosition === 'left' && !loadingButtons.has(button.id)" class="mr-2">
          {{ button.icon }}
        </span>

        {{ button.label }}

        <span v-if="button.icon && button.iconPosition === 'right' && !loadingButtons.has(button.id)" class="ml-2">
          {{ button.icon }}
        </span>
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div
      v-if="confirmingButton && confirmingButtonData"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h4 class="text-lg font-semibold">{{ confirmingButtonData.title }}</h4>
        <p class="mt-2 text-sm text-muted-foreground">{{ confirmingButtonData.message }}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            @click="handleCancelConfirm"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {{ confirmingButtonData.cancelLabel ?? 'Cancel' }}
          </button>
          <button
            type="button"
            @click="handleConfirm"
            :class="[
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2',
              confirmingButtonData.variant === 'danger'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            ]"
          >
            {{ confirmingButtonData.confirmLabel ?? 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ButtonGroupData, ButtonAction } from '@mcp-interactive-ui/types';

interface Props {
  data: ButtonGroupData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const confirmingButton = ref<string | null>(null);
const loadingButtons = ref<Set<string>>(new Set());

const buttonVariants: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const buttonSizes: Record<string, string> = {
  sm: 'h-9 rounded-md px-3',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 rounded-md px-8',
};

const layoutClass = computed(() => {
  const layout = props.data.layout ?? 'horizontal';
  switch (layout) {
    case 'horizontal':
      return 'flex flex-wrap gap-2';
    case 'vertical':
      return 'flex flex-col gap-2';
    case 'grid':
      return 'grid grid-cols-2 gap-2';
    default:
      return 'flex flex-wrap gap-2';
  }
});

const alignClass = computed(() => {
  const align = props.data.align ?? 'start';
  if (props.data.layout === 'vertical' && align === 'stretch') return '';

  switch (align) {
    case 'start':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'end':
      return 'justify-end';
    case 'stretch':
      return '';
    default:
      return 'justify-start';
  }
});

const confirmingButtonData = computed(() => {
  if (!confirmingButton.value) return null;
  const button = props.data.actions.find((a) => a.id === confirmingButton.value);
  return button?.confirmation ?? null;
});

const handleButtonClick = async (button: ButtonAction) => {
  // If button has confirmation, show confirmation dialog first
  if (button.confirmation && confirmingButton.value !== button.id) {
    confirmingButton.value = button.id;
    return;
  }

  // Clear confirmation state
  confirmingButton.value = null;

  // Set loading state
  loadingButtons.value = new Set(loadingButtons.value).add(button.id);

  try {
    emit('action', 'click', {
      buttonId: button.id,
      buttonLabel: button.label,
      timestamp: Date.now(),
    });
  } finally {
    const next = new Set(loadingButtons.value);
    next.delete(button.id);
    loadingButtons.value = next;
  }
};

const handleConfirm = () => {
  if (confirmingButton.value) {
    const button = props.data.actions.find((a) => a.id === confirmingButton.value);
    if (button) {
      handleButtonClick(button);
    }
  }
};

const handleCancelConfirm = () => {
  confirmingButton.value = null;
  emit('action', 'cancel', {});
};
</script>
