# Vue Integration

`@mcp-interactive-ui/vue` provides a complete Vue 3 renderer for all 25 interactive UI blocks. Uses pure Tailwind CSS to match shadcn/ui styling without requiring shadcn-vue.

## Installation

```bash
npm install @mcp-interactive-ui/vue @mcp-interactive-ui/types
```

## Quick Start

```vue
<script setup lang="ts">
import { RenderAIContent } from '@mcp-interactive-ui/vue'
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types'

const response: NormalizedAIResponse = {
  text: 'Here is your data:',
  blocks: [{
    type: 'stat_group',
    id: 'metrics',
    data: {
      items: [
        { label: 'Revenue', value: '$125K' },
        { label: 'Users', value: '8,420' }
      ]
    }
  }]
}

function handleAction(action) {
  console.log('Action:', action)
}
</script>

<template>
  <RenderAIContent 
    :data="response" 
    @action="handleAction" 
  />
</template>
```

## Composables

### `useAIContent`

Provides reactive access to the AI content context.

```vue
<script setup>
import { useAIContent } from '@mcp-interactive-ui/vue'

const { response, blocks, setResponse, handleAction } = useAIContent()

// Update content
setResponse(newResponse)
</script>
```

### `useBlockRegistry`

Access the block registry for custom blocks.

```vue
<script setup>
import { useBlockRegistry } from '@mcp-interactive-ui/vue'

const registry = useBlockRegistry()

// Register custom block
registry.register('custom_block', CustomBlockComponent)
</script>
```

## Custom Blocks

```vue
<!-- MyCustomBlock.vue -->
<template>
  <div class="p-4 border rounded">
    <h3>{{ data.title }}</h3>
    <p>{{ data.content }}</p>
    <button @click="emitAction">Click</button>
  </div>
</template>

<script setup>
const props = defineProps(['data', 'blockId'])
const emit = defineEmits(['action'])

function emitAction() {
  emit('action', { action: 'click', payload: {} })
}
</script>
```

```ts
// main.ts
import { createApp } from 'vue'
import { plugin as MCPPlugin } from '@mcp-interactive-ui/vue'
import MyCustomBlock from './MyCustomBlock.vue'

const app = createApp(App)

app.use(MCPPlugin, {
  blocks: {
    custom_block: MyCustomBlock
  }
})
```

## Styling

The Vue package uses pure Tailwind CSS with CSS variables matching shadcn/ui:

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        /* ... other shadcn variables */
      }
    }
  }
}
```

## Supported Blocks

All 25 blocks are supported:

- **Interactive**: `form_input`, `button_group`, `tabs`, `accordion`, `modal`, `progress`
- **Data Display**: `data_table`, `stat_group`, `metric_card`, `chart`, `comparison_table`
- **Content**: `markdown`, `code`, `list`, `gallery`, `timeline`
- **Navigation**: `breadcrumb`, `tree`, `carousel`
- **Advanced**: `kv_card`, `badge_group`, `json_viewer`, `diff_viewer`, `kanban`, `notice`

## Nuxt Integration

```ts
// plugins/mcp-ui.ts
import { plugin as MCPPlugin } from '@mcp-interactive-ui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MCPPlugin)
})
```

```vue
<!-- pages/index.vue -->
<template>
  <RenderAIContent :data="aiResponse" />
</template>

<script setup>
const { data: aiResponse } = await useFetch('/api/ai-response')
</script>
```
