<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
    <div class="space-y-2">
      <div
        v-for="[key, value] in entries"
        :key="key"
        class="flex justify-between items-center py-2 border-b last:border-b-0"
      >
        <span class="font-medium text-muted-foreground">{{ key }}</span>
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { KVCardData } from '@mcp-interactive-ui/types';

interface Props {
  data: KVCardData;
  blockId?: string;
}

const props = defineProps<Props>();

const entries = computed(() => Object.entries(props.data.entries));
</script>
