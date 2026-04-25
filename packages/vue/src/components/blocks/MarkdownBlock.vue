<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 prose dark:prose-invert max-w-none">
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MarkdownData } from '@mcp-interactive-ui/types';

interface Props {
  data: MarkdownData;
  blockId?: string;
}

const props = defineProps<Props>();

// Simple markdown rendering (in production, use a proper markdown library)
const renderedContent = computed(() => {
  return props.data.content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n/gim, '<br>');
});
</script>
