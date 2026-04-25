<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
    <!-- Main carousel area -->
    <div class="relative overflow-hidden">
      <div
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(item, index) in data.items"
          :key="index"
          class="w-full flex-shrink-0"
        >
          <div :class="aspectRatioClass" class="relative bg-muted">
            <!-- Image -->
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover"
            />

            <!-- Content overlay -->
            <div
              v-if="item.title || item.description"
              class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6"
            >
              <h4 v-if="item.title" class="text-xl font-semibold text-white">{{ item.title }}</h4>
              <p v-if="item.description" class="text-sm text-white/80 mt-1">{{ item.description }}</p>
              <a
                v-if="item.action"
                :href="item.action.href"
                class="mt-3 inline-flex items-center text-sm text-white hover:text-white/80"
              >
                {{ item.action.label }}
                <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <button
        v-if="showNavigation"
        type="button"
        @click="prev"
        :disabled="!canGoPrev"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors disabled:opacity-30"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="showNavigation"
        type="button"
        @click="next"
        :disabled="!canGoNext"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors disabled:opacity-30"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Indicators -->
    <div v-if="showIndicators" class="flex justify-center gap-2 p-4">
      <button
        v-for="(_, index) in data.items"
        :key="index"
        type="button"
        @click="goTo(index)"
        :class="[
          'transition-all rounded-full',
          currentIndex === index
            ? 'w-6 h-2 bg-primary'
            : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <!-- Thumbnails -->
    <div v-if="showThumbnails" class="flex gap-2 p-4 pt-0 overflow-x-auto">
      <button
        v-for="(item, index) in data.items"
        :key="index"
        type="button"
        @click="goTo(index)"
        :class="[
          'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
          currentIndex === index ? 'border-primary' : 'border-transparent hover:border-muted'
        ]"
      >
        <img
          v-if="item.thumbnailUrl || item.imageUrl"
          :src="item.thumbnailUrl || item.imageUrl"
          :alt="item.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
          {{ index + 1 }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CarouselData } from '@mcp-interactive-ui/types';

interface Props {
  data: CarouselData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const currentIndex = ref(props.data.defaultIndex ?? 0);

const showNavigation = computed(() => props.data.showNavigation ?? true);
const showIndicators = computed(() => props.data.showIndicators ?? true);
const showThumbnails = computed(() => props.data.showThumbnails ?? false);
const loop = computed(() => props.data.loop ?? true);
const autoplay = computed(() => props.data.autoplay ?? false);
const autoplayDelay = computed(() => props.data.autoplayDelay ?? 5000);

const aspectRatioClass = computed(() => {
  switch (props.data.aspectRatio) {
    case 'square':
      return 'aspect-square';
    case 'video':
      return 'aspect-video';
    case 'portrait':
      return 'aspect-[3/4]';
    default:
      return 'aspect-video';
  }
});

const canGoPrev = computed(() => {
  return loop.value || currentIndex.value > 0;
});

const canGoNext = computed(() => {
  return loop.value || currentIndex.value < props.data.items.length - 1;
});

const prev = () => {
  if (canGoPrev.value) {
    currentIndex.value = currentIndex.value === 0
      ? props.data.items.length - 1
      : currentIndex.value - 1;
    emitAction();
  }
};

const next = () => {
  if (canGoNext.value) {
    currentIndex.value = currentIndex.value === props.data.items.length - 1
      ? 0
      : currentIndex.value + 1;
    emitAction();
  }
};

const goTo = (index: number) => {
  currentIndex.value = index;
  emitAction();
};

const emitAction = () => {
  emit('action', 'slide_change', {
    index: currentIndex.value,
    item: props.data.items[currentIndex.value],
  });
};

// Autoplay
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (autoplay.value) {
    autoplayInterval = setInterval(next, autoplayDelay.value);
  }
});

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});
</script>
