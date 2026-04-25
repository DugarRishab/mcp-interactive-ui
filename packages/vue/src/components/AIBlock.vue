<template>
  <div class="mcp-ai-block">
    <component
      :is="blockComponent"
      v-if="blockComponent"
      :data="block.data"
      :block-id="block.id"
      @action="handleAction"
    />
    <div v-else class="p-4 border rounded bg-muted text-muted-foreground">
      Unknown block type: {{ block.type }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NormalizedBlock, BlockAction } from '@mcp-interactive-ui/types';
import { getDefaultBlockComponent } from '../registry';

interface Props {
  block: NormalizedBlock;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'action', action: BlockAction): void;
}>();

const blockComponent = computed(() => {
  return getDefaultBlockComponent(props.block.type);
});

const handleAction = (action: BlockAction) => {
  emit('action', action);
};
</script>
