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
            <th class="px-4 py-3 text-left font-medium">{{ data.featureLabel ?? 'Feature' }}</th>
            <th
              v-for="item in data.items"
              :key="item.id"
              class="px-4 py-3 text-center font-medium"
            >
              <div class="flex flex-col items-center gap-1">
                <span v-if="item.icon" class="text-lg">{{ item.icon }}</span>
                <span>{{ item.name }}</span>
                <span v-if="item.subtitle" class="text-xs text-muted-foreground font-normal">{{ item.subtitle }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(feature, fIdx) in data.features"
            :key="fIdx"
            class="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
          >
            <td class="px-4 py-3 font-medium">{{ feature.name }}</td>
            <td
              v-for="item in data.items"
              :key="item.id"
              class="px-4 py-3 text-center"
            >
              <div class="flex items-center justify-center">
                <!-- Checkmark for true values -->
                <svg
                  v-if="item.values[feature.key] === true"
                  class="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>

                <!-- X for false values -->
                <svg
                  v-else-if="item.values[feature.key] === false"
                  class="h-5 w-5 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <!-- Text value -->
                <span v-else>{{ item.values[feature.key] }}</span>
              </div>
            </td>
          </tr>

          <!-- Footer row with actions -->
          <tr v-if="data.showActions" class="border-t bg-muted/30">
            <td class="px-4 py-3"></td>
            <td
              v-for="item in data.items"
              :key="item.id"
              class="px-4 py-3 text-center"
            >
              <button
                v-if="item.action"
                type="button"
                @click="handleAction(item)"
                :class="[
                  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2',
                  item.action.variant === 'primary'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                ]"
              >
                {{ item.action.label }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComparisonTableData } from '@mcp-interactive-ui/types';

interface Props {
  data: ComparisonTableData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const handleAction = (item: typeof props.data.items[0]) => {
  if (item.action) {
    emit('action', 'item_action', {
      itemId: item.id,
      itemName: item.name,
      action: item.action,
    });
  }
};
</script>
