<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
    <div v-if="data.title || data.description" class="p-6 pb-4">
      <h3 v-if="data.title" class="text-lg font-semibold">{{ data.title }}</h3>
      <p v-if="data.description" class="text-sm text-muted-foreground">{{ data.description }}</p>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th
              v-for="column in data.columns"
              :key="column.key"
              class="px-4 py-3 text-left font-medium"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in data.rows"
            :key="idx"
            class="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
          >
            <td
              v-for="column in data.columns"
              :key="column.key"
              class="px-4 py-3"
            >
              {{ row[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DataTableData } from '@mcp-interactive-ui/types';

interface Props {
  data: DataTableData;
  blockId?: string;
}

defineProps<Props>();
</script>
