<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 v-if="data.title" class="text-lg font-semibold mb-4">{{ data.title }}</h3>

    <!-- Grid Layout -->
    <div
      v-if="layout === 'grid'"
      :class="[
        'grid gap-4',
        columnsClass
      ]"
    >
      <div
        v-for="(image, index) in data.images"
        :key="index"
        :class="[
          'relative group cursor-pointer overflow-hidden rounded-lg',
          aspectRatioClass
        ]"
        @click="openLightbox(index)"
      >
        <img
          :src="image.thumbnailUrl || image.url"
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <p v-if="image.title" class="font-medium">{{ image.title }}</p>
            <p v-if="image.caption" class="text-sm">{{ image.caption }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- List Layout -->
    <div v-if="layout === 'list'" class="space-y-4">
      <div
        v-for="(image, index) in data.images"
        :key="index"
        class="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
        @click="openLightbox(index)"
      >
        <img
          :src="image.thumbnailUrl || image.url"
          :alt="image.alt"
          class="w-24 h-24 object-cover rounded-md flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p v-if="image.title" class="font-medium">{{ image.title }}</p>
          <p v-if="image.caption" class="text-sm text-muted-foreground mt-1">{{ image.caption }}</p>
          <div v-if="image.metadata" class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(value, key) in image.metadata"
              :key="key"
              class="text-xs px-2 py-1 rounded bg-muted"
            >
              {{ key }}: {{ value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Layout -->
    <div v-if="layout === 'carousel'" class="relative">
      <div class="overflow-hidden rounded-lg">
        <div
          class="flex transition-transform duration-300"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(image, index) in data.images"
            :key="index"
            class="w-full flex-shrink-0"
          >
            <div :class="aspectRatioClass" class="relative">
              <img
                :src="image.url"
                :alt="image.alt"
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p v-if="image.title" class="font-medium text-white">{{ image.title }}</p>
                <p v-if="image.caption" class="text-sm text-white/80">{{ image.caption }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel controls -->
      <button
        type="button"
        @click="prevImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        @click="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Dots indicator -->
      <div class="flex justify-center gap-2 mt-4">
        <button
          v-for="(_, index) in data.images"
          :key="index"
          type="button"
          @click="currentIndex = index"
          :class="[
            'w-2 h-2 rounded-full transition-colors',
            currentIndex === index ? 'bg-primary' : 'bg-muted'
          ]"
        />
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body" v-if="lightboxOpen && data.lightbox !== false">
      <div
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        @click="closeLightbox"
      >
        <div class="relative max-w-4xl max-h-full" @click.stop>
          <img
            :src="data.images[lightboxIndex].url"
            :alt="data.images[lightboxIndex].alt"
            class="max-w-full max-h-[90vh] object-contain rounded-lg"
          />

          <!-- Lightbox controls -->
          <button
            type="button"
            @click.stop="prevLightbox"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            @click.stop="nextLightbox"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            @click="closeLightbox"
            class="absolute right-4 top-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image info -->
          <div class="absolute bottom-4 left-4 right-4 text-center text-white">
            <p v-if="data.images[lightboxIndex].title" class="font-medium">{{ data.images[lightboxIndex].title }}</p>
            <p v-if="data.images[lightboxIndex].caption" class="text-sm text-white/80">{{ data.images[lightboxIndex].caption }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { GalleryData } from '@mcp-interactive-ui/types';

interface Props {
  data: GalleryData;
  blockId?: string;
}

const props = defineProps<Props>();

const layout = computed(() => props.data.layout ?? 'grid');
const currentIndex = ref(0);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const columnsClass = computed(() => {
  const cols = props.data.columns ?? 3;
  return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols}`;
});

const aspectRatioClass = computed(() => {
  switch (props.data.aspectRatio) {
    case 'square':
      return 'aspect-square';
    case 'video':
      return 'aspect-video';
    case 'portrait':
      return 'aspect-[3/4]';
    default:
      return 'aspect-auto';
  }
});

const openLightbox = (index: number) => {
  if (props.data.lightbox === false) return;
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
};

const nextLightbox = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.data.images.length;
};

const prevLightbox = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + props.data.images.length) % props.data.images.length;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.data.images.length;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.data.images.length) % props.data.images.length;
};

// Autoplay
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (props.data.autoplay && layout.value === 'carousel') {
    autoplayInterval = setInterval(nextImage, props.data.autoplayDelay ?? 5000);
  }
});

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});
</script>
