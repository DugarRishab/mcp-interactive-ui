<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
    <!-- Header with filename and copy button -->
    <div
      v-if="data.filename || data.copyable !== false"
      class="flex items-center justify-between px-4 py-3 border-b bg-muted/50"
    >
      <div class="flex items-center gap-2">
        <span v-if="data.language" class="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground uppercase">
          {{ data.language }}
        </span>
        <span v-if="data.filename" class="text-sm font-medium text-foreground">{{ data.filename }}</span>
      </div>
      <button
        v-if="data.copyable !== false"
        type="button"
        @click="copyToClipboard"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg
          v-if="!copied"
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg
          v-else
          class="h-4 w-4 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <!-- Code content -->
    <div class="relative">
      <pre
        :class="[
          'p-4 text-sm font-mono overflow-x-auto bg-muted/30',
          data.wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
        ]"
        :style="maxHeightStyle"
      ><code><span
          v-for="(line, index) in lines"
          :key="index"
          class="block"
          :class="[
            showLineNumbers ? 'pl-12' : '',
            isHighlighted(index + 1) ? 'bg-yellow-500/10 -mx-4 px-4' : ''
          ]"
        ><span
            v-if="showLineNumbers"
            class="absolute left-0 w-8 text-right text-muted-foreground select-none"
          >{{ index + 1 }}</span><span class="text-foreground">{{ line || ' ' }}</span></span></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CodeData } from '@mcp-interactive-ui/types';

interface Props {
  data: CodeData;
  blockId?: string;
}

const props = defineProps<Props>();

const copied = ref(false);

const showLineNumbers = computed(() => props.data.showLineNumbers ?? true);

const lines = computed(() => {
  return props.data.content.split('\n');
});

const maxHeightStyle = computed(() => {
  if (props.data.maxHeight) {
    return { maxHeight: `${props.data.maxHeight}px`, overflowY: 'auto' };
  }
  return {};
});

const isHighlighted = (lineNumber: number) => {
  return props.data.highlightLines?.includes(lineNumber) ?? false;
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.data.content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
