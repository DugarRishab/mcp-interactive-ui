<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 v-if="data.title" class="text-lg font-semibold mb-4">{{ data.title }}</h3>

    <div :class="orientation === 'horizontal' ? 'flex gap-4 overflow-x-auto' : 'space-y-6'">
      <div
        v-for="(event, index) in sortedEvents"
        :key="event.id"
        :class="[
          'relative',
          orientation === 'horizontal' ? 'flex-shrink-0 min-w-[200px]' : ''
        ]"
      >
        <!-- Timeline connector -->
        <div
          v-if="orientation === 'vertical' && index !== sortedEvents.length - 1"
          class="absolute left-4 top-8 bottom-0 w-0.5 bg-border"
          style="transform: translateY(8px); height: calc(100% + 24px);"
        />

        <div :class="orientation === 'horizontal' ? '' : 'flex gap-4'">
          <!-- Icon/dot -->
          <div
            :class="[
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm',
              colorClasses[event.color ?? 'default']
            ]"
          >
            <span v-if="event.icon">{{ event.icon }}</span>
            <span v-else>{{ event.title.charAt(0).toUpperCase() }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium">{{ event.title }}</span>
              <span class="text-xs text-muted-foreground">
                {{ formatDate(event.timestamp) }}
              </span>
            </div>

            <p v-if="event.description" class="text-sm text-muted-foreground mt-1">
              {{ event.description }}
            </p>

            <!-- Metadata -->
            <div v-if="event.metadata && Object.keys(event.metadata).length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(value, key) in event.metadata"
                :key="key"
                class="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
              >
                {{ key }}: {{ value }}
              </span>
            </div>

            <!-- Links -->
            <div v-if="event.links && event.links.length > 0" class="flex flex-wrap gap-2 mt-2">
              <a
                v-for="link in event.links"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-primary hover:underline"
              >
                {{ link.label }}
              </a>
            </div>

            <!-- Media -->
            <div v-if="event.media" class="mt-2">
              <img
                v-if="event.media.type === 'image'"
                :src="event.media.url"
                :alt="event.title"
                class="rounded-lg max-h-32 object-cover"
              />
              <video
                v-if="event.media.type === 'video'"
                :src="event.media.url"
                controls
                class="rounded-lg max-h-32"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimelineData } from '@mcp-interactive-ui/types';

interface Props {
  data: TimelineData;
  blockId?: string;
}

const props = defineProps<Props>();

const orientation = computed(() => props.data.orientation ?? 'vertical');

const sortedEvents = computed(() => {
  let events = [...props.data.events];

  // Sort by timestamp
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Reverse if requested
  if (props.data.reverse) {
    events.reverse();
  }

  // Limit if maxVisible is set
  if (props.data.maxVisible && props.data.maxVisible > 0) {
    events = events.slice(0, props.data.maxVisible);
  }

  return events;
});

const colorClasses: Record<string, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-destructive text-destructive-foreground',
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
