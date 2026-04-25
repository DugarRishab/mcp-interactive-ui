<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm" role="presentation">
    <div v-if="data.title || data.description" class="p-6 pb-4">
      <h3 v-if="data.title" class="text-lg font-semibold">{{ data.title }}</h3>
      <p v-if="data.description" class="text-sm text-muted-foreground">{{ data.description }}</p>
    </div>

    <div class="p-6 pt-0">
      <div class="divide-y rounded-md border">
        <div
          v-for="item in data.items"
          :key="item.id"
          class="overflow-hidden"
        >
          <button
            type="button"
            :id="`${blockId || 'accordion'}-trigger-${item.id}`"
            :aria-expanded="isOpen(item.id)"
            :aria-controls="`${blockId || 'accordion'}-content-${item.id}`"
            :aria-disabled="item.disabled"
            @click="handleToggle(item.id)"
            :disabled="item.disabled"
            :class="[
              'flex w-full items-center justify-between p-4 font-medium transition-all hover:bg-muted/50',
              item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            ]"
          >
            <div class="flex items-center gap-2">
              <span v-if="item.icon" class="text-muted-foreground">{{ item.icon }}</span>
              <div class="text-left">
                <div class="text-sm font-medium">{{ item.title }}</div>
                <div v-if="item.subtitle" class="text-xs text-muted-foreground">{{ item.subtitle }}</div>
              </div>
            </div>
            <svg
              :class="[
                'h-4 w-4 shrink-0 transition-transform duration-200',
                isOpen(item.id) ? 'rotate-180' : ''
              ]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-show="isOpen(item.id)"
            :id="`${blockId || 'accordion'}-content-${item.id}`"
            role="region"
            :aria-labelledby="`${blockId || 'accordion'}-trigger-${item.id}`"
            :aria-hidden="!isOpen(item.id)"
            class="overflow-hidden transition-all"
          >
            <div class="p-4 pt-0">
              <div
                v-if="item.content && item.content.length > 0"
                class="space-y-4"
              >
                <component
                  v-for="block in item.content"
                  :key="block.id"
                  :is="getBlockComponent(block.type)"
                  :data="block.data"
                  :block-id="block.id"
                  @action="(action: string, payload: unknown) => handleBlockAction(block.id, action, payload)"
                />
              </div>
              <div v-else class="text-sm text-muted-foreground">No content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { AccordionData } from '@mcp-interactive-ui/types';
import { getDefaultBlockComponent } from '../../registry';
import type { BlockType } from '@mcp-interactive-ui/types';

interface Props {
  data: AccordionData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const openItems = ref<Set<string>>(new Set());

onMounted(() => {
  // Initialize default open items
  props.data.items.forEach((item) => {
    if (item.defaultOpen) {
      openItems.value.add(item.id);
    }
  });
});

const isOpen = (itemId: string) => openItems.value.has(itemId);

const handleToggle = (itemId: string) => {
  const item = props.data.items.find((i) => i.id === itemId);
  if (!item || item.disabled) return;

  const isCurrentlyOpen = openItems.value.has(itemId);
  const type = props.data.type ?? 'single';
  const collapsible = props.data.collapsible ?? true;

  // If single type, close others
  if (type === 'single') {
    if (isCurrentlyOpen && collapsible) {
      openItems.value.delete(itemId);
    } else {
      openItems.value = new Set([itemId]);
    }
  } else {
    // Multiple type
    const newSet = new Set(openItems.value);
    if (isCurrentlyOpen && collapsible) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    openItems.value = newSet;
  }

  emit('action', 'section_toggle', {
    itemId,
    itemTitle: item.title,
    isOpen: !isCurrentlyOpen,
    timestamp: Date.now(),
  });
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
</script>
