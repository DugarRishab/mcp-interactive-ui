<template>
  <div class="mcp-ai-content" :class="className">
    <AIBlock
      v-for="block in blocks"
      :key="block.id"
      :block="block"
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NormalizedAIResponse, BlockAction } from '@mcp-interactive-ui/types';
import AIBlock from './AIBlock.vue';

interface Props {
  data: NormalizedAIResponse;
  className?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'blockAction', action: BlockAction): void;
}>();

const blocks = computed(() => props.data.blocks);

const handleAction = (action: BlockAction) => {
  emit('blockAction', action);
};
</script>
