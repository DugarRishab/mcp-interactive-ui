<template>
  <nav aria-label="Breadcrumb" class="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
    <ol class="flex flex-wrap items-center gap-2 text-sm">
      <li
        v-for="(item, index) in data.items"
        :key="index"
        class="flex items-center"
      >
        <!-- Separator -->
        <span
          v-if="index > 0"
          class="mx-2 text-muted-foreground"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>

        <!-- Link or Text -->
        <a
          v-if="item.href && !item.disabled"
          :href="item.href"
          :class="[
            'hover:text-foreground transition-colors',
            index === data.items.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'
          ]"
        >
          <span v-if="item.icon" class="mr-1">{{ item.icon }}</span>
          {{ item.label }}
        </a>
        <span
          v-else
          :class="[
            'flex items-center',
            index === data.items.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground',
            item.disabled ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          <span v-if="item.icon" class="mr-1">{{ item.icon }}</span>
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbData } from '@mcp-interactive-ui/types';

interface Props {
  data: BreadcrumbData;
  blockId?: string;
}

defineProps<Props>();
</script>
