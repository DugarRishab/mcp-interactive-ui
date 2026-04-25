<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 v-if="data.title" class="text-lg font-semibold mb-4">{{ data.title }}</h3>

    <!-- Ordered List -->
    <ol v-if="data.type === 'ordered'" :class="listClasses">
      <li
        v-for="(item, index) in data.items"
        :key="index"
        :class="itemClasses"
      >
        <span class="font-medium text-muted-foreground mr-2">{{ index + 1 }}.</span>
        <span v-if="typeof item === 'string'">{{ item }}</span>
        <div v-else class="flex-1">
          <p class="font-medium">{{ item.title }}</p>
          <p v-if="item.description" class="text-sm text-muted-foreground">{{ item.description }}</p>
        </div>
      </li>
    </ol>

    <!-- Unordered List -->
    <ul v-else-if="data.type === 'unordered'" :class="listClasses">
      <li
        v-for="(item, index) in data.items"
        :key="index"
        :class="itemClasses"
      >
        <span class="text-muted-foreground mr-2">•</span>
        <span v-if="typeof item === 'string'">{{ item }}</span>
        <div v-else class="flex-1">
          <p class="font-medium">{{ item.title }}</p>
          <p v-if="item.description" class="text-sm text-muted-foreground">{{ item.description }}</p>
        </div>
      </li>
    </ul>

    <!-- Checklist -->
    <div v-else-if="data.type === 'checklist'" :class="listClasses">
      <div
        v-for="(item, index) in data.items"
        :key="index"
        :class="[
          itemClasses,
          'cursor-pointer hover:bg-muted/50 rounded-md -mx-2 px-2 py-1'
        ]"
        @click="toggleItem(index)"
      >
        <div
          :class="[
            'w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors',
            checkedItems.has(index)
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-muted-foreground'
          ]"
        >
          <svg
            v-if="checkedItems.has(index)"
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span
          :class="[
            checkedItems.has(index) ? 'line-through text-muted-foreground' : ''
          ]"
        >
          {{ typeof item === 'string' ? item : item.title }}
        </span>
      </div>
    </div>

    <!-- Nested List -->
    <ul v-else-if="data.type === 'nested'" :class="listClasses">
      <li
        v-for="(item, index) in data.items"
        :key="index"
        class="space-y-2"
      >
        <div :class="itemClasses">
          <span class="text-muted-foreground mr-2">•</span>
          <span class="font-medium">{{ item.title }}</span>
        </div>
        <ul v-if="item.children" class="ml-6 space-y-1">
          <li
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            class="flex items-start gap-2"
          >
            <span class="text-muted-foreground">◦</span>
            <span>{{ typeof child === 'string' ? child : child.title }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ListData } from '@mcp-interactive-ui/types';

interface Props {
  data: ListData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const checkedItems = ref<Set<number>>(new Set());

const listClasses = computed(() => {
  const gap = props.data.gap ?? 'md';
  const gapClass = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-3',
  }[gap];

  return `list-none ${gapClass}`;
});

const itemClasses = computed(() => {
  const size = props.data.size ?? 'md';
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  return `flex items-start ${sizeClass}`;
});

const toggleItem = (index: number) => {
  if (props.data.type !== 'checklist') return;

  const newSet = new Set(checkedItems.value);
  if (newSet.has(index)) {
    newSet.delete(index);
  } else {
    newSet.add(index);
  }
  checkedItems.value = newSet;

  const item = props.data.items[index];
  emit('action', 'item_toggle', {
    index,
    checked: newSet.has(index),
    item: typeof item === 'string' ? item : item.title,
  });
};
</script>
