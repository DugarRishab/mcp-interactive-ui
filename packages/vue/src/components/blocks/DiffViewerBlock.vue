<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-muted-foreground">{{ data.originalLabel ?? 'Original' }}</span>
        <svg class="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span class="text-sm font-medium">{{ data.modifiedLabel ?? 'Modified' }}</span>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 bg-green-500/20 border border-green-500 rounded"></span>
          Added
        </span>
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 bg-red-500/20 border border-red-500 rounded"></span>
          Removed
        </span>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm font-mono">
        <tbody>
          <tr
            v-for="(line, index) in diffLines"
            :key="index"
            :class="lineClass(line.type)"
          >
            <!-- Line numbers -->
            <td class="w-12 px-2 py-1 text-right text-muted-foreground select-none bg-muted/30 border-r">
              {{ line.oldLine ?? '' }}
            </td>
            <td class="w-12 px-2 py-1 text-right text-muted-foreground select-none bg-muted/30 border-r">
              {{ line.newLine ?? '' }}
            </td>

            <!-- Content -->
            <td class="px-4 py-1 whitespace-pre">
              <span v-if="line.type === 'add'" class="text-green-700 dark:text-green-300">+ {{ line.content }}</span>
              <span v-else-if="line.type === 'remove'" class="text-red-700 dark:text-red-300">- {{ line.content }}</span>
              <span v-else class="text-foreground">  {{ line.content }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DiffViewerData } from '@mcp-interactive-ui/types';

interface Props {
  data: DiffViewerData;
  blockId?: string;
}

const props = defineProps<Props>();

interface DiffLine {
  type: 'context' | 'add' | 'remove';
  content: string;
  oldLine?: number;
  newLine?: number;
}

const diffLines = computed((): DiffLine[] => {
  const original = props.data.original.split('\n');
  const modified = props.data.modified.split('\n');

  // Simple diff algorithm (LCS would be better but this is a basic implementation)
  const lines: DiffLine[] = [];
  let oldLine = 1;
  let newLine = 1;

  // Very naive diff - just compare line by line
  const maxLines = Math.max(original.length, modified.length);

  for (let i = 0; i < maxLines; i++) {
    const origLine = original[i];
    const modLine = modified[i];

    if (origLine === modLine) {
      lines.push({
        type: 'context',
        content: origLine || '',
        oldLine: oldLine++,
        newLine: newLine++,
      });
    } else if (origLine !== undefined && modLine === undefined) {
      lines.push({
        type: 'remove',
        content: origLine,
        oldLine: oldLine++,
      });
    } else if (origLine === undefined && modLine !== undefined) {
      lines.push({
        type: 'add',
        content: modLine,
        newLine: newLine++,
      });
    } else {
      // Both exist but different - treat as remove then add
      lines.push({
        type: 'remove',
        content: origLine,
        oldLine: oldLine++,
      });
      lines.push({
        type: 'add',
        content: modLine,
        newLine: newLine++,
      });
    }
  }

  return lines;
});

const lineClass = (type: string) => {
  switch (type) {
    case 'add':
      return 'bg-green-500/10';
    case 'remove':
      return 'bg-red-500/10';
    default:
      return '';
  }
};
</script>
