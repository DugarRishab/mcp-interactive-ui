# MCP Interactive UI: Comprehensive Implementation Plan

A unified 16-week sprint plan combining the best architectural decisions from both roadmap documents, with corrections for shadcn-only UI components, proper directory structure, mocked LLM examples, and theme inheritance from parent shadcn projects.

---

## Directory Structure

```
mcp-interactive-ui/
├── apps/
│   └── docs/                    # Documentation site (outside packages)
├── examples/
│   ├── react-chat/             # Mocked LLM responses only
│   ├── vue-dashboard/          # Mocked LLM responses only
│   ├── langchain-agent/        # Mocked LLM responses only
│   └── node-api/               # Mocked LLM responses only
├── packages/
│   ├── types/                  # Zod schemas (existing)
│   ├── core/                   # Registry, validation (existing)
│   ├── react/                  # React renderer (existing)
│   ├── vue/                    # NEW - Vue 3 renderer
│   ├── langchain/              # NEW - LangChain integration
│   ├── anthropic/              # NEW - Anthropic SDK adapter
│   ├── cli/                    # NEW - CLI tooling
│   ├── testing/                # NEW - Testing utilities
│   └── server/                 # MCP server (existing)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Key Corrections from Original Plans

### 1. UI Components: shadcn/ui Only

**React Components:**
- All components use shadcn/ui primitives (Button, Card, Dialog, Tabs, etc.)
- Charts use **shadcn/ui built-in chart components** (`<ChartContainer>`, `<BarChart>`, `<LineChart>`, etc.)
- **NO Recharts, Chart.js, or other external chart libraries**
- Styling via Tailwind CSS with CSS variables

**Vue Components:**
- Use Tailwind CSS to replicate shadcn/ui design system
- Headless UI Vue for accessible primitives (modals, dropdowns, etc.)
- Charts: Custom Tailwind-styled chart components matching shadcn chart appearance
- **NO shadcn-vue dependency** - pure Tailwind implementation

### 2. Directory Structure Correction

```diff
- apps/
-   └── docs/               # WRONG - was inside packages in original plans

+ apps/
+   └── docs/               # CORRECT - apps is sibling to packages
```

### 3. Examples: Mocked LLM Only

All examples use **pre-defined mock responses** - no actual LLM API calls:
- Purpose: Showcase component rendering capabilities
- Mock response generator simulates LLM output patterns
- Users can see how components look without API keys
- No streaming, no rate limits, no costs

### 4. Theme System: Parent Project Inheritance

```typescript
// Theme provider accepts explicit theme OR inherits from parent shadcn project
interface ThemeProviderProps {
  theme?: ThemeConfig;           // Explicit theme (optional)
  inheritFromParent?: boolean;  // Use parent's CSS variables if shadcn project
  children: React.ReactNode;
}

// If inheritFromParent=true, reads CSS variables from :root
// Falls back to default theme if not in shadcn project
```

### 5. Claude Desktop Plugin: SKIPPED

- **Completely removed** from plan per user requirements
- No MCP server plugin example
- No claude_desktop_config.json files

---

## Part 1: Phase 2 Interactive Blocks (Weeks 1-4)

### 1.1 Core Type System Updates

**File: `packages/types/src/blocks/interactive.ts`**

```typescript
export interface BlockAction {
  blockId: string;
  blockType: string;
  action: string;
  payload: unknown;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface InteractiveBlockBase {
  id: string;
  type: BlockType;
  data: unknown;
  onAction?: (action: BlockAction) => Promise<void>;
}
```

**File: `packages/react/src/types.ts`**

```typescript
export interface RenderAIContentProps {
  data: NormalizedAIResponse;
  className?: string;
  components?: Partial<BlockComponentMap>;
  onBlockAction?: (action: BlockAction) => void;  // Callback for all block actions
  onUnknownBlock?: (block: NormalizedBlock) => void;
}
```

### 1.2 Interactive Block Definitions

#### Block: `form_input`

**Schema:**
```typescript
export const formFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string(),
  type: z.enum([
    'text', 'email', 'password', 'number', 'textarea',
    'select', 'multiselect', 'checkbox', 'radio',
    'date', 'datetime-local', 'time', 'url', 'tel', 'color'
  ]),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
    disabled: z.boolean().optional(),
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    customError: z.string().optional(),
  }).optional(),
  helpText: z.string().optional(),
  disabled: z.boolean().default(false),
});

export const formInputDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema).min(1).max(50),
  submitLabel: z.string().default('Submit'),
  cancelLabel: z.string().optional(),
  resetLabel: z.string().optional(),
  layout: z.enum(['vertical', 'horizontal', 'grid']).default('vertical'),
  columns: z.number().min(1).max(4).default(1),
});
```

**Actions:**
- `field_change` - Real-time field value changes
- `field_blur` - Field validation trigger
- `submit` - Form submission with all values
- `cancel` - Cancel button clicked
- `reset` - Reset button clicked

**React Component (`FormInputBlock.tsx`):**
- Uses shadcn Form, Input, Textarea, Select, Checkbox, Label components
- Real-time validation with Zod
- Accessible ARIA labels
- Loading state during submission

---

#### Block: `button_group`

**Schema:**
```typescript
export const buttonActionSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  variant: z.enum(['primary', 'secondary', 'danger', 'ghost', 'outline', 'link']).default('secondary'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  icon: z.string().optional(), // Lucide icon name
  iconPosition: z.enum(['left', 'right']).default('left'),
  disabled: z.boolean().default(false),
  loading: z.boolean().default(false),
  confirmation: z.object({
    title: z.string(),
    message: z.string(),
    confirmLabel: z.string().default('Confirm'),
    cancelLabel: z.string().default('Cancel'),
    variant: z.enum(['default', 'danger']).default('default'),
  }).optional(),
  description: z.string().optional(),
});

export const buttonGroupDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  actions: z.array(buttonActionSchema).min(1).max(10),
  layout: z.enum(['horizontal', 'vertical', 'grid']).default('horizontal'),
  align: z.enum(['start', 'center', 'end', 'stretch']).default('start'),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});
```

**Actions:**
- `click` - Button clicked (after confirmation if present)

**React Component:**
- Uses shadcn Button component
- Confirmation modal using shadcn Dialog
- Icon support with dynamic lucide-react imports

---

#### Block: `tabs`

**Schema:**
```typescript
export const tabItemSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  icon: z.string().optional(),
  content: z.array(z.lazy(() => normalizedBlockSchema)), // NESTED BLOCKS
  disabled: z.boolean().default(false),
  badge: z.string().optional(),
  tooltip: z.string().optional(),
});

export const tabsDataSchema = z.object({
  title: z.string().optional(),
  tabs: z.array(tabItemSchema).min(1).max(10),
  defaultTab: z.string().optional(),
  variant: z.enum(['default', 'outline', 'pills']).default('default'),
  orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
  persistState: z.boolean().default(false),
});
```

**Actions:**
- `tab_change` - Tab switched

**React Component:**
- Uses shadcn Tabs component
- Recursively renders nested blocks in tab content
- State persistence to localStorage if persistState=true

---

#### Block: `accordion`

**Schema:**
```typescript
export const accordionItemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  subtitle: z.string().optional(),
  content: z.array(z.lazy(() => normalizedBlockSchema)), // NESTED BLOCKS
  icon: z.string().optional(),
  defaultOpen: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const accordionDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(accordionItemSchema).min(1).max(20),
  type: z.enum(['single', 'multiple']).default('single'),
  collapsible: z.boolean().default(true),
});
```

**Actions:**
- `section_toggle` - Section expanded/collapsed

**React Component:**
- Uses shadcn Accordion component
- Nested block rendering
- Smooth animations

---

#### Block: `modal`

**Schema:**
```typescript
export const modalDataSchema = z.object({
  id: z.string(),
  isOpen: z.boolean().default(true),
  title: z.string(),
  description: z.string().optional(),
  content: z.array(z.lazy(() => normalizedBlockSchema)), // NESTED BLOCKS
  size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('md'),
  variant: z.enum(['default', 'alert', 'confirm']).default('default'),
  footer: z.object({
    showCloseButton: z.boolean().default(true),
    closeLabel: z.string().default('Close'),
    actions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      variant: z.enum(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']).default('default'),
      primary: z.boolean().default(false),
    })).optional(),
  }).default({}),
  closeOnOverlayClick: z.boolean().default(true),
  closeOnEsc: z.boolean().default(true),
  preventScroll: z.boolean().default(true),
});
```

**Actions:**
- `open` - Modal opened
- `close` - Modal closed (X button, overlay click, ESC)
- `action_click` - Footer action clicked
- `confirm` - Confirm variant specific
- `cancel` - Cancel variant specific

**React Component:**
- Uses shadcn Dialog component
- Portal-based rendering
- Focus trap for accessibility
- Body scroll lock

---

#### Block: `progress`

**Schema:**
```typescript
export const progressStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'error', 'skipped']).default('pending'),
  icon: z.string().optional(),
  errorMessage: z.string().optional(),
  timestamp: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const progressDataSchema = z.object({
  title: z.string().optional(),
  variant: z.enum(['linear', 'circular', 'steps', 'vertical_steps']).default('linear'),
  value: z.number().min(0).max(100).optional(),
  max: z.number().default(100),
  indeterminate: z.boolean().default(false),
  showPercentage: z.boolean().default(true),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  color: z.enum(['default', 'primary', 'success', 'warning', 'error']).default('primary'),
  steps: z.array(progressStepSchema).optional(),
  currentStep: z.string().optional(),
  clickable: z.boolean().default(false),
  label: z.string().optional(),
  sublabel: z.string().optional(),
});
```

**Actions:**
- `step_click` - Step clicked (if clickable=true)

**React Component:**
- Uses shadcn Progress component for linear variant
- Custom SVG + shadcn styling for circular variant
- Steps variant with icons and status colors

---

## Part 2: Read-Only Blocks (Weeks 3-8)

### 2.1 Chart Block (shadcn Charts)

**Critical Correction:** Uses **shadcn/ui built-in chart components**, NOT Recharts or Chart.js.

**Schema:**
```typescript
export const chartDatasetSchema = z.object({
  label: z.string(),
  data: z.array(z.number()),
  color: z.string().optional(), // Tailwind color class or CSS color
});

export const chartDataSchema = z.object({
  type: z.enum(['bar', 'line', 'pie', 'doughnut', 'area', 'radar']),
  title: z.string().optional(),
  description: z.string().optional(),
  data: z.object({
    labels: z.array(z.string()),
    datasets: z.array(chartDatasetSchema).min(1).max(5),
  }),
  options: z.object({
    legend: z.boolean().default(true),
    tooltip: z.boolean().default(true),
    grid: z.boolean().default(true),
    stacked: z.boolean().default(false),
    xAxisLabel: z.string().optional(),
    yAxisLabel: z.string().optional(),
    height: z.number().default(300),
    animations: z.boolean().default(true),
  }).default({}),
});
```

**React Implementation:**
```tsx
// packages/react/src/blocks/ChartBlock.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ChartBlock({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={generateChartConfig(data)} className={`h-[${data.options.height}px]`}>
          {/* shadcn chart components based on data.type */}
          {data.type === 'bar' && <BarChart data={transformData(data)}>...</BarChart>}
          {data.type === 'line' && <LineChart data={transformData(data)}>...</LineChart>}
          {/* etc. */}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

---

### 2.2 Code Block

**Schema:**
```typescript
export const codeDataSchema = z.object({
  content: z.string().max(50000),
  language: z.string().default('text'),
  filename: z.string().optional(),
  showLineNumbers: z.boolean().default(true),
  highlightLines: z.array(z.number()).optional(),
  wrapLines: z.boolean().default(false),
  copyable: z.boolean().default(true),
  collapsible: z.boolean().default(false),
  collapsed: z.boolean().default(false),
  maxHeight: z.number().optional(),
  diff: z.object({
    original: z.string(),
    modified: z.string(),
    language: z.string(),
  }).optional(),
});
```

**Implementation:**
- Syntax highlighting: Shiki (better quality) or Prism.js
- Copy to clipboard button using shadcn Button
- Scrollable container with shadcn ScrollArea
- Theme-aware colors via CSS variables

---

### 2.3 Timeline Block

**Schema:**
```typescript
export const timelineEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(), // ISO 8601
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.enum(['default', 'primary', 'success', 'warning', 'error']).default('default'),
  metadata: z.record(z.string()).optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).optional(),
  media: z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
  }).optional(),
});

export const timelineDataSchema = z.object({
  title: z.string().optional(),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
  events: z.array(timelineEventSchema).min(1).max(100),
  groupBy: z.enum(['none', 'day', 'week', 'month', 'year']).default('none'),
  collapsible: z.boolean().default(false),
  maxVisible: z.number().optional(),
  reverse: z.boolean().default(false),
});
```

---

### 2.4 Gallery Block

**Schema:**
```typescript
export const galleryImageSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  alt: z.string(),
  title: z.string().optional(),
  caption: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const galleryDataSchema = z.object({
  title: z.string().optional(),
  images: z.array(galleryImageSchema).min(1).max(50),
  layout: z.enum(['grid', 'masonry', 'carousel', 'list']).default('grid'),
  columns: z.number().min(1).max(6).default(3),
  aspectRatio: z.enum(['square', 'video', 'portrait', 'auto']).default('auto'),
  gap: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  lightbox: z.boolean().default(true),
  allowDownload: z.boolean().default(false),
  allowFullscreen: z.boolean().default(true),
  autoplay: z.boolean().default(false),
  autoplayDelay: z.number().default(5000),
});
```

---

### 2.5 Additional Read-Only Blocks

| Block | Description | Priority |
|-------|-------------|----------|
| `list` | Ordered/unordered/checklist with rich content | High |
| `breadcrumb` | Navigation breadcrumb | Medium |
| `badge_group` | Collection of badges/tags | Medium |
| `metric_card` | Single metric with context | High |
| `comparison_table` | Side-by-side comparison | Medium |
| `json_viewer` | Collapsible JSON tree | Low |
| `diff_viewer` | Side-by-side code diff | Medium |
| `kanban` | Read-only kanban board | Low |
| `tree` | Hierarchical tree view | Low |
| `carousel` | Content carousel | Medium |

---

## Part 3: Nested Blocks System (Week 2)

Blocks like `tabs`, `accordion`, `modal`, and `carousel` can contain other blocks.

### Schema Changes

```typescript
// Self-referential type for nested blocks
export type BlockContent = NormalizedBlock | NormalizedBlock[];

// Update tabs schema to support nesting
export const tabsDataSchema = z.object({
  // ... other fields
  tabs: z.array(z.object({
    id: z.string(),
    label: z.string(),
    content: z.lazy(() => z.array(normalizedBlockSchema)), // NESTED
  })),
});
```

### React Implementation

```tsx
// packages/react/src/components/NestedBlockRenderer.tsx
interface NestedBlockRendererProps {
  blocks: NormalizedBlock[];
  onBlockAction?: (action: BlockAction) => void;
  depth?: number; // Track nesting depth
}

const MAX_NESTING_DEPTH = 3;

export function NestedBlockRenderer({ blocks, onBlockAction, depth = 0 }: NestedBlockRendererProps) {
  if (depth >= MAX_NESTING_DEPTH) {
    return <NoticeBlock data={{ variant: 'warning', message: 'Maximum nesting depth exceeded' }} />;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <SingleBlockRenderer
          key={block.id}
          block={block}
          onBlockAction={onBlockAction}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
```

---

## Part 4: Vue Package (Weeks 5-8)

### 4.1 Package Structure

```
packages/vue/
├── src/
│   ├── composables/
│   │   ├── useAIContent.ts
│   │   ├── useBlockRegistry.ts
│   │   └── useTheme.ts
│   ├── components/
│   │   ├── RenderAIContent.vue
│   │   ├── AIBlock.vue
│   │   ├── FormInputBlock.vue
│   │   ├── ButtonGroupBlock.vue
│   │   ├── TabsBlock.vue
│   │   ├── AccordionBlock.vue
│   │   ├── ModalBlock.vue
│   │   ├── ProgressBlock.vue
│   │   ├── DataTableBlock.vue
│   │   ├── KVCardBlock.vue
│   │   ├── StatGroupBlock.vue
│   │   ├── NoticeBlock.vue
│   │   ├── MarkdownBlock.vue
│   │   ├── ChartBlock.vue           # Tailwind-styled charts
│   │   ├── CodeBlock.vue
│   │   ├── TimelineBlock.vue
│   │   ├── GalleryBlock.vue
│   │   ├── ListBlock.vue
│   │   ├── BreadcrumbsBlock.vue
│   │   ├── DiffViewerBlock.vue
│   │   ├── KanbanBlock.vue
│   │   ├── TreeBlock.vue
│   │   └── CarouselBlock.vue
│   ├── utils/
│   │   └── format.ts
│   ├── types.ts
│   ├── index.ts
│   └── registry.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 4.2 Styling Approach (Tailwind, NOT shadcn-vue)

Vue components use **pure Tailwind CSS** to replicate shadcn/ui design:

```vue
<!-- Vue component styled like shadcn -->
<template>
  <button 
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium',
      'ring-offset-background transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      // ... other variants
    ]"
  >
    <slot />
  </button>
</template>
```

### 4.3 Main Composable

```typescript
// packages/vue/src/composables/useAIContent.ts
import { ref, computed, provide, inject } from 'vue';
import type { NormalizedAIResponse, NormalizedBlock, BlockAction } from '@mcp-interactive-ui/types';

const AIContentKey = Symbol('AIContent');

export interface UseAIContentOptions {
  registry?: ReturnType<typeof getDefaultRegistry>;
  onBlockAction?: (action: BlockAction) => void;
}

export function useAIContentProvider(options: UseAIContentOptions = {}) {
  const response = ref<NormalizedAIResponse | null>(null);
  const blocks = computed(() => response.value?.blocks || []);

  const setResponse = (data: NormalizedAIResponse) => {
    response.value = data;
  };

  const handleAction = (action: BlockAction) => {
    options.onBlockAction?.(action);
  };

  provide(AIContentKey, { response, blocks, setResponse, handleAction });

  return { response, blocks, setResponse, handleAction };
}

export function useAIContent() {
  const context = inject(AIContentKey);
  if (!context) {
    throw new Error('useAIContent must be used within AIContentProvider');
  }
  return context;
}
```

---

## Part 5: Theme System (Weeks 3-4)

### 5.1 Theme Architecture

**Key Feature:** Theme provider can inherit from parent shadcn project OR use explicit theme.

```typescript
// packages/react/src/theme/types.ts
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    destructive: string;
    muted: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Theme provider props
interface ThemeProviderProps {
  theme?: ThemeConfig;
  inheritFromParent?: boolean;  // NEW: Inherit parent's CSS variables
  children: React.ReactNode;
}
```

### 5.2 Theme Provider with Parent Inheritance

```tsx
// packages/react/src/theme/ThemeProvider.tsx
export function ThemeProvider({ theme, inheritFromParent = true, children }: ThemeProviderProps) {
  const [inheritedTheme, setInheritedTheme] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    if (inheritFromParent) {
      // Try to read CSS variables from parent shadcn project
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      // Check if --primary CSS variable exists (indicates shadcn project)
      const primary = computedStyle.getPropertyValue('--primary');

      if (primary) {
        // Inherit from parent shadcn project
        setInheritedTheme({
          colors: {
            primary: computedStyle.getPropertyValue('--primary'),
            secondary: computedStyle.getPropertyValue('--secondary'),
            destructive: computedStyle.getPropertyValue('--destructive'),
            // ... other variables
          },
          borderRadius: {
            sm: computedStyle.getPropertyValue('--radius'),
            md: computedStyle.getPropertyValue('--radius'),
            lg: computedStyle.getPropertyValue('--radius'),
          },
        });
      }
    }
  }, [inheritFromParent]);

  // Use explicit theme > inherited theme > default theme
  const activeTheme = theme || inheritedTheme || defaultTheme;

  return (
    <ThemeContext.Provider value={activeTheme}>
      <div style={generateCSSVariables(activeTheme)}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

### 5.3 Preset Themes

1. **Light** (default) - Clean, professional
2. **Dark** - OLED-friendly dark colors
3. **Minimal** - Grayscale
4. **Brand** - Customizable primary color
5. **High Contrast** - WCAG AAA compliance
6. **Colorblind** - Deuteranopia/protanopia-friendly

---

## Part 6: Framework Adapters (Weeks 7-10)

### 6.1 Anthropic Adapter

**Package:** `packages/anthropic/`

```typescript
// packages/anthropic/src/index.ts
import Anthropic from '@anthropic-ai/sdk';

export function registryToAnthropicTools(registry: FrozenRegistry) {
  return registry.all().map(block => ({
    name: block.type,
    description: block.description,
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        data: block.jsonSchema,
      },
      required: ['id', 'data'],
    },
  }));
}

export async function chat(userMessage: string, options: AnthropicAdapterOptions = {}) {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: options.model || 'claude-3-sonnet-20240229',
    max_tokens: 4096,
    system: buildSystemPrompt(registry),
    tools: registryToAnthropicTools(registry),
    messages: [{ role: 'user', content: userMessage }],
  });

  // Parse tool_use blocks into normalized blocks
  const blocks = parseAnthropicToolCalls(response);
  const text = extractTextContent(response);

  return normalizeLLMResponse({ text, blocks }, registry);
}
```

### 6.2 LangChain Adapter

**Package:** `packages/langchain/`

```typescript
// packages/langchain/src/index.ts
import { tool } from '@langchain/core/tools';

export function createLangChainTools(registry: FrozenRegistry) {
  return registry.all().map(block => {
    return tool(
      async (input) => JSON.stringify({ success: true, block: input }),
      {
        name: block.type,
        description: block.description,
        schema: z.object({
          id: z.string(),
          data: block.schema,
        }),
      }
    );
  });
}

export async function invokeWithUI(llm: BaseChatModel, userMessage: string, registry: FrozenRegistry) {
  const tools = createLangChainTools(registry);
  const llmWithTools = llm.bindTools(tools);

  const response = await llmWithTools.invoke([
    { role: 'system', content: buildSystemPrompt(registry) },
    { role: 'user', content: userMessage },
  ]);

  const toolCalls = response.tool_calls || [];
  const blocks = toolCalls.map(call => ({
    type: call.name,
    id: call.args.id,
    data: call.args.data,
  }));

  return normalizeLLMResponse({ text: response.content, blocks }, registry);
}
```

---

## Part 7: Testing Utilities (Weeks 1-6)

### 7.1 Package Structure

```
packages/testing/
├── src/
│   ├── validators/
│   │   ├── validateBlock.ts
│   │   ├── validateResponse.ts
│   │   └── validateAction.ts
│   ├── generators/
│   │   ├── generateBlock.ts
│   │   ├── generateResponse.ts
│   │   └── generateAction.ts
│   ├── mocks/
│   │   ├── mockRegistry.ts
│   │   ├── mockResponses.ts
│   │   └── mockBlocks.ts
│   ├── snapshots/
│   │   └── toMatchBlockSnapshot.ts
│   ├── performance/
│   │   └── benchmark.ts
│   └── index.ts
├── package.json
└── vitest.config.ts
```

### 7.2 Mock Response Generators

```typescript
// packages/testing/src/mocks/mockResponses.ts
export const mockTableResponse: NormalizedAIResponse = {
  text: 'Here is your data:',
  blocks: [{
    type: 'data_table',
    id: 'table-1',
    data: {
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'status', header: 'Status', type: 'badge' },
      ],
      rows: [
        { name: 'Alice', status: 'Active' },
        { name: 'Bob', status: 'Pending' },
      ],
    },
  }],
};

export const mockFormResponse: NormalizedAIResponse = {
  text: 'Please fill out this form:',
  blocks: [{
    type: 'form_input',
    id: 'form-1',
    data: {
      title: 'Contact Information',
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Message', type: 'textarea' },
      ],
    },
  }],
};

// More mock responses for each block type...
```

---

## Part 8: CLI Tooling (Weeks 9-12)

### 8.1 Package Structure

```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── init.ts
│   │   ├── add-block.ts
│   │   ├── validate.ts
│   │   ├── preview.ts
│   │   ├── generate-prompt.ts
│   │   └── dev.ts
│   ├── templates/
│   │   ├── block-schema.ts.hbs
│   │   ├── block-react.tsx.hbs
│   │   ├── block-vue.vue.hbs
│   │   └── index.ts
│   ├── utils/
│   │   ├── fileSystem.ts
│   │   └── validation.ts
│   └── index.ts
├── bin/
│   └── mcp-ui.js
├── package.json
└── tsconfig.json
```

### 8.2 CLI Commands

| Command | Description |
|---------|-------------|
| `mcp-ui init [framework]` | Initialize project with mcp-interactive-ui |
| `mcp-ui add block <name>` | Add new custom block |
| `mcp-ui validate <file>` | Validate JSON against block schemas |
| `mcp-ui preview [file]` | Start preview server for block |
| `mcp-ui generate prompt` | Generate system prompt for LLM |
| `mcp-ui dev` | Start dev mode with hot reload |

---

## Part 9: Documentation Site (Weeks 11-16)

### 9.1 Tech Stack

- **Framework:** Vite + MDX
- **UI:** shadcn/ui components
- **Styling:** Tailwind CSS
- **Search:** Fuse.js
- **Syntax:** Shiki

### 9.2 Structure

```
apps/docs/                      # Outside packages/ (corrected)
├── src/
│   ├── components/
│   │   ├── BlockPreview.tsx    # Live block preview
│   │   ├── CodeExample.tsx
│   │   ├── Navigation.tsx
│   │   └── Search.tsx
│   ├── pages/
│   │   ├── index.mdx
│   │   ├── getting-started/
│   │   │   ├── installation.mdx
│   │   │   ├── quickstart.mdx
│   │   │   ├── react.mdx
│   │   │   ├── vue.mdx
│   │   │   ├── openai.mdx
│   │   │   ├── anthropic.mdx
│   │   │   └── langchain.mdx
│   │   ├── blocks/
│   │   │   ├── index.mdx       # Block catalog
│   │   │   ├── data-table.mdx
│   │   │   ├── form-input.mdx
│   │   │   ├── chart.mdx
│   │   │   └── ... (one per block)
│   │   ├── packages/
│   │   │   ├── core.mdx
│   │   │   ├── react.mdx
│   │   │   ├── vue.mdx
│   │   │   └── cli.mdx
│   │   ├── integrations/
│   │   │   ├── openai.mdx
│   │   │   ├── anthropic.mdx
│   │   │   └── langchain.mdx
│   │   └── api/
│   │       └── ... (auto-generated)
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── package.json
└── vite.config.ts
```

### 9.3 Mock LLM for Interactive Demos

```typescript
// apps/docs/src/utils/mockLLM.ts
export function generateMockResponse(userInput: string): NormalizedAIResponse {
  // Simple keyword matching to generate mock blocks
  const input = userInput.toLowerCase();

  if (input.includes('table')) {
    return mockTableResponse;
  }
  if (input.includes('form')) {
    return mockFormResponse;
  }
  if (input.includes('chart')) {
    return mockChartResponse;
  }
  // ... more keywords

  return {
    text: 'Here is a general response.',
    blocks: [],
  };
}
```

---

## Part 10: Example Applications (Weeks 13-16)

All examples use **mocked LLM responses** - no API keys required.

### 10.1 React Chat Example

**Location:** `examples/react-chat/`

**Tech Stack:**
- React 18 + Vite
- @mcp-interactive-ui/react
- shadcn/ui
- Mock LLM response generator

**Features:**
- Multi-turn conversation (mocked)
- All block types supported
- Interactive form handling
- Theme switching

### 10.2 Vue Dashboard Example

**Location:** `examples/vue-dashboard/`

**Tech Stack:**
- Vue 3 + Vite
- @mcp-interactive-ui/vue
- Tailwind CSS (shadcn-like styling)
- Mock LLM response generator

### 10.3 LangChain Agent Example

**Location:** `examples/langchain-agent/`

**Tech Stack:**
- Node.js
- @mcp-interactive-ui/langchain
- Mock LLM responses

### 10.4 Node API Example

**Location:** `examples/node-api/`

**Tech Stack:**
- Express.js
- @mcp-interactive-ui/core
- Mock LLM responses

---

## Implementation Timeline

### Sprint 1 (Weeks 1-2): Interactive Blocks Foundation
- [ ] `form_input` block (React + shadcn Form)
- [ ] `button_group` block (React + shadcn Button)
- [ ] Callback system in React package
- [ ] Action validation
- [ ] Testing package setup
- [ ] Mock response generators

### Sprint 2 (Weeks 3-4): Complete Interactive Blocks
- [ ] `tabs` block with nested blocks support
- [ ] `accordion` block with nested blocks
- [ ] `modal` block with nested blocks
- [ ] `progress` block (linear, circular, steps)
- [ ] Theme system with parent inheritance
- [ ] Nested block renderer with depth limiting

### Sprint 3 (Weeks 5-6): Read-Only Blocks Batch 1
- [ ] `chart` block using **shadcn/ui charts** (not Recharts)
- [ ] `code` block with Shiki syntax highlighting
- [ ] `timeline` block
- [ ] `gallery` block
- [ ] Vue package setup
- [ ] Vue: Phase 1 blocks (data_table, kv_card, stat_group, notice, markdown)

### Sprint 4 (Weeks 7-8): Read-Only Blocks Batch 2 + Vue
- [ ] `list` block
- [ ] `breadcrumb` block
- [ ] `diff_viewer` block
- [ ] `kanban` block
- [ ] `tree` block
- [ ] `carousel` block
- [ ] Vue: all interactive blocks (form_input, button_group, tabs, accordion, modal, progress)
- [ ] Vue: Tailwind styling matching shadcn

### Sprint 5 (Weeks 9-10): Framework Adapters
- [ ] Anthropic SDK adapter package
- [ ] LangChain adapter package
- [ ] Testing utilities complete (validators, generators, mocks)
- [ ] Performance benchmarking tools

### Sprint 6 (Weeks 11-12): CLI + Documentation Site
- [ ] CLI: init, add-block, validate, preview commands
- [ ] CLI: generate-prompt, dev commands
- [ ] Documentation site framework
- [ ] Block documentation (all 20+ blocks)
- [ ] Mock LLM integration for demos

### Sprint 7 (Weeks 13-14): Examples + Guides
- [ ] Example: React Chat (mocked LLM)
- [ ] Example: Vue Dashboard (mocked LLM)
- [ ] Example: LangChain Agent (mocked LLM)
- [ ] Example: Node API (mocked LLM)
- [ ] Integration guides complete

### Sprint 8 (Weeks 15-16): Polish + Release
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Documentation review
- [ ] v1.0 release preparation

---

## Success Metrics

### Code Quality
- 85%+ test coverage
- 100% TypeScript strict mode
- Zero ESLint errors
- Zero type errors

### Performance
- Core package: <50KB gzipped
- React package: <100KB gzipped
- Vue package: <100KB gzipped
- Table render: <100ms for 500 rows
- Chart render: <200ms

### Documentation
- 100+ pages
- 50+ code examples
- 4 complete example apps (mocked LLM)
- 0 broken links

---

## Notes

- **All React components use shadcn/ui primitives** - no external UI libraries
- **Charts use shadcn/ui built-in chart components** - not Recharts or Chart.js
- **Vue uses Tailwind CSS** to replicate shadcn design - not shadcn-vue
- **Examples use mocked LLM responses** - no API keys required, no actual LLM calls
- **Theme provider inherits from parent shadcn projects** - seamless integration
- **apps/docs is outside packages/** - correct monorepo structure
- **No Claude Desktop plugin** - skipped per user requirements
