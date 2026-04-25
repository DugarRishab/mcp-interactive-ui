<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div v-if="data.title" class="p-6 pb-0">
      <h3 class="text-lg font-semibold">{{ data.title }}</h3>
    </div>

    <div :class="orientation === 'vertical' ? 'flex gap-4' : ''">
      <!-- Tab List -->
      <div
        :class="[
          'p-6',
          orientation === 'vertical' ? 'flex-col border-r pr-4' : 'border-b pb-0'
        ]"
      >
        <div
          :class="[
            'flex gap-1',
            orientation === 'vertical' ? 'flex-col' : ''
          ]"
        >
          <button
            v-for="tab in data.tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            :disabled="tab.disabled"
            :class="[
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
          >
            <span v-if="tab.icon" class="mr-2">{{ tab.icon }}</span>
            {{ tab.label }}
            <span
              v-if="tab.badge"
              class="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors"
            >
              {{ tab.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6 pt-0">
        <div v-for="tab in data.tabs" :key="tab.id">
          <div v-if="activeTab === tab.id" class="mt-2">
            <div
              v-if="tab.content && tab.content.length > 0"
              class="space-y-4"
            >
              <component
                v-for="block in tab.content"
                :key="block.id"
                :is="getBlockComponent(block.type)"
                :data="block.data"
                :block-id="block.id"
                @action="(action: string, payload: unknown) => handleBlockAction(block.id, action, payload)"
              />
            </div>
            <div v-else class="text-sm text-muted-foreground">No content</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { TabsData } from '@mcp-interactive-ui/types';
import { getDefaultBlockComponent } from '../../registry';
import type { BlockType } from '@mcp-interactive-ui/types';

interface Props {
  data: TabsData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const activeTab = ref<string>('');

const orientation = computed(() => props.data.orientation ?? 'horizontal');

onMounted(() => {
  // Load persisted state if enabled
  if (props.data.persistState && props.blockId) {
    const saved = localStorage.getItem(`tabs-${props.blockId}`);
    if (saved) {
      const tabId = JSON.parse(saved);
      if (props.data.tabs.find((t) => t.id === tabId)) {
        activeTab.value = tabId;
        return;
      }
    }
  }
  // Set default tab
  activeTab.value = props.data.defaultTab ?? props.data.tabs[0]?.id ?? '';
});

const handleTabChange = (tabId: string) => {
  const tab = props.data.tabs.find((t) => t.id === tabId);
  if (!tab || tab.disabled) return;

  activeTab.value = tabId;

  // Persist state if enabled
  if (props.data.persistState && props.blockId) {
    localStorage.setItem(`tabs-${props.blockId}`, JSON.stringify(tabId));
  }

  emit('action', 'tab_change', {
    tabId,
    tabLabel: tab.label,
    timestamp: Date.now(),
  });
};

const getBlockComponent = (type: BlockType) => {
  return getDefaultBlockComponent(type) || 'div';
};

const handleBlockAction = (blockId: string, action: string, payload: unknown) => {
  emit('action', 'nested_action', {
    blockId,
    action,
    payload,
  });
};
</script>
