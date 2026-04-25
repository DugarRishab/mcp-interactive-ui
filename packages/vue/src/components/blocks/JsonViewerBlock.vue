<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">JSON</span>
      </div>
      <button
        type="button"
        @click="copyToClipboard"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg
          v-if="!copied"
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg
          v-else
          class="h-4 w-4 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <div class="p-4 overflow-x-auto">
      <pre class="text-sm font-mono"><code><JsonNode :value="data.value" :level="0" /></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import type { JsonViewerData } from '@mcp-interactive-ui/types';

interface Props {
  data: JsonViewerData;
  blockId?: string;
}

const props = defineProps<Props>();

const copied = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.data.value, null, 2));
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Recursive JSON node component
const JsonNode = {
  props: ['value', 'level'],
  setup(props: { value: unknown; level: number }) {
    const indent = '  '.repeat(props.level);
    const value = props.value;
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

    const toggle = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const content = target.nextElementSibling as HTMLElement;
      const expanded = content.style.display !== 'none';
      content.style.display = expanded ? 'none' : 'block';
      target.querySelector('.toggle-icon')!.textContent = expanded ? '▶' : '▼';
    };

    if (type === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      const isEmpty = entries.length === 0;

      return () =>
        h('span', {}, [
          h('span', {
            class: 'cursor-pointer hover:opacity-70',
            onClick: toggle,
          }, [
            h('span', { class: 'toggle-icon text-muted-foreground mr-1' }, '▼'),
            h('span', { class: 'text-foreground' }, '{'),
            isEmpty ? null : h('span', { class: 'text-muted-foreground' }, ` ${entries.length} items `),
            h('span', { class: 'text-foreground' }, '}'),
          ]),
          h('span', { style: { display: 'block' } }, [
            h('span', { class: 'text-foreground' }, '{'),
            entries.length > 0
              ? h('div', { style: { paddingLeft: '1rem' } },
                  entries.map(([key, val]) =>
                    h('div', {}, [
                      h('span', { class: 'text-purple-500' }, JSON.stringify(key)),
                      h('span', { class: 'text-foreground' }, ': '),
                      h(JsonNode, { value: val, level: props.level + 1 }),
                    ])
                  )
                )
              : null,
            h('span', {}, indent + '}'),
          ]),
        ]);
    }

    if (type === 'array') {
      const arr = value as unknown[];
      const isEmpty = arr.length === 0;

      return () =>
        h('span', {}, [
          h('span', {
            class: 'cursor-pointer hover:opacity-70',
            onClick: toggle,
          }, [
            h('span', { class: 'toggle-icon text-muted-foreground mr-1' }, '▼'),
            h('span', { class: 'text-foreground' }, '['),
            isEmpty ? null : h('span', { class: 'text-muted-foreground' }, ` ${arr.length} items `),
            h('span', { class: 'text-foreground' }, ']'),
          ]),
          h('span', { style: { display: 'block' } }, [
            h('span', { class: 'text-foreground' }, '['),
            arr.length > 0
              ? h('div', { style: { paddingLeft: '1rem' } },
                  arr.map((item, i) =>
                    h('div', {}, [
                      h(JsonNode, { value: item, level: props.level + 1 }),
                      i < arr.length - 1 ? h('span', { class: 'text-foreground' }, ',') : null,
                    ])
                  )
                )
              : null,
            h('span', {}, indent + ']'),
          ]),
        ]);
    }

    // Primitive values
    const colorClass = {
      string: 'text-green-600 dark:text-green-400',
      number: 'text-blue-600 dark:text-blue-400',
      boolean: 'text-yellow-600 dark:text-yellow-400',
      null: 'text-red-600 dark:text-red-400',
    }[type as string] || 'text-foreground';

    return () =>
      h('span', { class: colorClass }, JSON.stringify(value));
  },
};
</script>
