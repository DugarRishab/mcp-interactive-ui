<template>
  <div>
    <!-- Modal Portal -->
    <Teleport to="body" v-if="isOpen">
      <div
        class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        @click="handleOverlayClick"
      >
        <div
          class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          :class="sizeClasses[data.size ?? 'md']"
          @click.stop
        >
          <!-- Header -->
          <div class="flex flex-col space-y-1.5 text-center sm:text-left">
            <h3 class="text-lg font-semibold leading-none tracking-tight">{{ data.title }}</h3>
            <p v-if="data.description" class="text-sm text-muted-foreground">{{ data.description }}</p>
          </div>

          <!-- Content -->
          <div class="py-4">
            <div
              v-if="data.content && data.content.length > 0"
              class="space-y-4"
            >
              <component
                v-for="block in data.content"
                :key="block.id"
                :is="getBlockComponent(block.type)"
                :data="block.data"
                :block-id="block.id"
                @action="(action: string, payload: unknown) => handleBlockAction(block.id, action, payload)"
              />
            </div>
          </div>

          <!-- Footer -->
          <div v-if="data.footer" class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              v-if="data.footer.showCloseButton !== false"
              type="button"
              @click="handleClose"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
            >
              {{ data.footer.closeLabel ?? 'Close' }}
            </button>
            <button
              v-for="action in data.footer.actions"
              :key="action.id"
              type="button"
              @click="handleActionClick(action.id, action.label)"
              :class="[
                'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2',
                action.variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : action.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              ]"
            >
              {{ action.label }}
            </button>
          </div>

          <!-- Close X button -->
          <button
            type="button"
            @click="handleClose"
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { ModalData } from '@mcp-interactive-ui/types';
import { getDefaultBlockComponent } from '../../registry';
import type { BlockType } from '@mcp-interactive-ui/types';

interface Props {
  data: ModalData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const isOpen = ref(props.data.isOpen ?? true);

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const handleClose = () => {
  isOpen.value = false;
  emit('action', 'close', {
    timestamp: Date.now(),
  });
};

const handleOverlayClick = () => {
  if (props.data.closeOnOverlayClick !== false) {
    handleClose();
  }
};

const handleActionClick = (actionId: string, actionLabel: string) => {
  emit('action', 'action_click', {
    actionId,
    actionLabel,
    timestamp: Date.now(),
  });

  // Check for confirm/cancel variants
  if (props.data.variant === 'confirm' || props.data.variant === 'alert') {
    if (actionId === 'confirm') {
      emit('action', 'confirm', {
        timestamp: Date.now(),
      });
    } else if (actionId === 'cancel') {
      emit('action', 'cancel', {
        timestamp: Date.now(),
      });
    }
  }
};

const getBlockComponent = (type: BlockType) => {
  return getDefaultBlockComponent(type) || 'div';
};

const handleBlockAction = (blockId: string, action: string, payload: unknown) => {
  emit('action', 'nested_action', {
    blockId,
    action,
    payload,
  });
};

// Handle ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value && props.data.closeOnEsc !== false) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);

  // Prevent body scroll if enabled
  if (props.data.preventScroll !== false && isOpen.value) {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// Watch for isOpen changes to handle body scroll
const watchIsOpen = computed(() => isOpen.value);
if (watchIsOpen.value && props.data.preventScroll !== false) {
  document.body.style.overflow = 'hidden';
} else {
  document.body.style.overflow = '';
}
</script>
