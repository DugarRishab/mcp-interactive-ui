<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 v-if="data.title" class="text-lg font-semibold mb-4">{{ data.title }}</h3>

    <div class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="column in data.columns"
        :key="column.id"
        class="flex-shrink-0 w-72"
      >
        <!-- Column Header -->
        <div
          class="p-3 rounded-t-lg font-medium text-sm"
          :class="headerColorClasses[column.color ?? 'default']"
        >
          <div class="flex items-center justify-between">
            <span>{{ column.title }}</span>
            <span class="text-xs opacity-70">{{ column.items.length }}</span>
          </div>
        </div>

        <!-- Column Items -->
        <div class="p-2 bg-muted/30 rounded-b-lg min-h-[200px] space-y-2">
          <div
            v-for="item in column.items"
            :key="item.id"
            class="p-3 bg-card rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="handleItemClick(item, column)"
          >
            <div class="flex items-start gap-2">
              <div v-if="item.priority" class="mt-1">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="priorityClasses[item.priority]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm">{{ item.title }}</p>
                <p v-if="item.description" class="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {{ item.description }}
                </p>

                <!-- Tags -->
                <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="text-xs px-1.5 py-0.5 rounded bg-muted"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Assignee & Due Date -->
                <div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span v-if="item.assignee">@{{ item.assignee }}</span>
                  <span v-if="item.dueDate" :class="isOverdue(item.dueDate) ? 'text-red-500' : ''">
                    {{ formatDate(item.dueDate) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="column.items.length === 0" class="text-center py-8 text-sm text-muted-foreground">
            No items
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KanbanData, KanbanItem, KanbanColumn } from '@mcp-interactive-ui/types';

interface Props {
  data: KanbanData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const headerColorClasses: Record<string, string> = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-destructive text-destructive-foreground',
};

const priorityClasses: Record<string, string> = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const handleItemClick = (item: KanbanItem, column: KanbanColumn) => {
  emit('action', 'item_click', {
    itemId: item.id,
    itemTitle: item.title,
    columnId: column.id,
    columnTitle: column.title,
  });
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
</script>
