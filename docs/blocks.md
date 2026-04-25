# Block Catalog

25 schema-validated UI blocks that LLMs can reliably generate. Every block has a stable `id`, a discriminator `type`, a Zod schema, and both React and Vue implementations.

---

## Interactive Blocks

These blocks accept user input and emit actions.

### `form_input`

Complete form builder with 14+ field types, validation, and real-time feedback.

```typescript
{
  title?: string;
  description?: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 
          'select' | 'multiselect' | 'checkbox' | 'radio' | 
          'date' | 'datetime-local' | 'time' | 'url' | 'tel' | 'color';
    required?: boolean;
    placeholder?: string;
    defaultValue?: string | number | boolean | string[];
    options?: Array<{ label: string; value: string; disabled?: boolean }>;
    validation?: {
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      customError?: string;
    };
    helpText?: string;
    disabled?: boolean;
  }>;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: 1 | 2 | 3 | 4;
}
```

**Actions:** `field_change`, `field_blur`, `submit`, `cancel`, `reset`

---

### `button_group`

Action buttons with variants, icons, confirmations, and loading states.

```typescript
{
  title?: string;
  description?: string;
  actions: Array<{
    id: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link';
    size?: 'sm' | 'md' | 'lg';
    icon?: string; // Lucide icon name
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    confirmation?: {
      title: string;
      message: string;
      confirmLabel?: string;
      cancelLabel?: string;
      variant?: 'default' | 'danger';
    };
    description?: string;
  }>;
  layout?: 'horizontal' | 'vertical' | 'grid';
  align?: 'start' | 'center' | 'end' | 'stretch';
}
```

**Actions:** `click`

---

### `tabs`

Tabbed interface with nested block support and state persistence.

```typescript
{
  title?: string;
  tabs: Array<{
    id: string;
    label: string;
    icon?: string;
    content: Block[]; // Nested blocks
    disabled?: boolean;
    badge?: string;
    tooltip?: string;
  }>;
  defaultTab?: string;
  variant?: 'default' | 'outline' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  persistState?: boolean;
}
```

**Actions:** `tab_change`

---

### `accordion`

Collapsible sections with nested block content.

```typescript
{
  title?: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    content: Block[]; // Nested blocks
    icon?: string;
    defaultOpen?: boolean;
    disabled?: boolean;
  }>;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}
```

**Actions:** `section_toggle`

---

### `modal`

Dialog overlays with nested content and configurable footer actions.

```typescript
{
  id: string;
  isOpen?: boolean;
  title: string;
  description?: string;
  content: Block[]; // Nested blocks
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'alert' | 'confirm';
  footer?: {
    showCloseButton?: boolean;
    closeLabel?: string;
    actions?: Array<{
      id: string;
      label: string;
      variant?: string;
      primary?: boolean;
    }>;
  };
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}
```

**Actions:** `open`, `close`, `action_click`, `confirm`, `cancel`

---

### `progress`

Progress indicators: linear, circular, steps, and vertical steps variants.

```typescript
{
  title?: string;
  variant: 'linear' | 'circular' | 'steps' | 'vertical_steps';
  value?: number;
  max?: number;
  indeterminate?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  steps?: Array<{
    id: string;
    label: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'error' | 'skipped';
    icon?: string;
    errorMessage?: string;
  }>;
  currentStep?: string;
  clickable?: boolean;
}
```

**Actions:** `step_click` (if clickable=true)

---

## Data Display Blocks

### `data_table`

Tabular data display with up to 20 columns and 500 rows.

```typescript
{
  columns: Array<{
    key: string;
    header: string;
    type?: 'text' | 'number' | 'currency' | 'date' | 'badge';
  }>;
  rows: Array<Record<string, string | number | boolean | null>>;
  caption?: string;
}
```

---

### `stat_group`

1-8 KPI tiles with optional deltas and trend indicators.

```typescript
{
  items: Array<{
    label: string;
    value: string | number;
    hint?: string;
    delta?: {
      value: number;
      direction: 'up' | 'down' | 'flat';
      label?: string;
    };
  }>;
}
```

---

### `metric_card`

Single metric display with trend, sparkline, and contextual info.

```typescript
{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    value: number;
    label?: string;
  };
  sparkline?: number[];
  comparison?: {
    label: string;
    value: string | number;
  };
}
```

---

### `chart`

Data visualizations using shadcn/ui chart components.

```typescript
{
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'radar';
  title?: string;
  description?: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      color?: string;
    }>;
  };
  options?: {
    legend?: boolean;
    tooltip?: boolean;
    grid?: boolean;
    stacked?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    height?: number;
    animations?: boolean;
  };
}
```

---

### `comparison_table`

Side-by-side comparison of multiple items across features.

```typescript
{
  title?: string;
  items: Array<{ id: string; name: string; [key: string]: unknown }>;
  features: Array<{
    key: string;
    label: string;
    type?: 'text' | 'boolean' | 'badge' | 'rating';
  }>;
  highlightWinner?: boolean;
}
```

---

## Content Blocks

### `markdown`

Up to 10,000 chars of GitHub-flavored markdown, sanitized.

```typescript
{ content: string }
```

Rendered through `rehype-sanitize` with a strict allowlist: no `<script>`, no `<iframe>`, no inline styles, no event handlers, no non-http(s)/mailto hrefs.

---

### `code`

Syntax-highlighted code with copy button and line numbers.

```typescript
{
  content: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  wrapLines?: boolean;
  copyable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  maxHeight?: number;
}
```

---

### `list`

Ordered, unordered, and checklists with rich content support.

```typescript
{
  type: 'ordered' | 'unordered' | 'checklist';
  items: Array<{
    content: string;
    checked?: boolean;
    items?: Array<...>; // Nested items
  }>;
  title?: string;
  dense?: boolean;
}
```

---

### `gallery`

Image galleries with grid, masonry, carousel, and lightbox layouts.

```typescript
{
  title?: string;
  images: Array<{
    url: string;
    thumbnailUrl?: string;
    alt: string;
    title?: string;
    caption?: string;
    metadata?: Record<string, string>;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel' | 'list';
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  lightbox?: boolean;
  allowDownload?: boolean;
  allowFullscreen?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
}
```

---

### `timeline`

Event timeline with vertical/horizontal orientations.

```typescript
{
  title?: string;
  orientation?: 'vertical' | 'horizontal';
  events: Array<{
    id: string;
    timestamp: string; // ISO 8601
    title: string;
    description?: string;
    icon?: string;
    color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    metadata?: Record<string, string>;
    links?: Array<{ label: string; url: string }>;
    media?: { type: 'image' | 'video'; url: string };
  }>;
  groupBy?: 'none' | 'day' | 'week' | 'month' | 'year';
  collapsible?: boolean;
  maxVisible?: number;
  reverse?: boolean;
}
```

---

## Navigation Blocks

### `breadcrumb`

Navigation trail with clickable segments.

```typescript
{
  items: Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  separator?: 'slash' | 'chevron' | 'arrow';
}
```

---

### `tree`

Hierarchical tree view with expand/collapse.

```typescript
{
  nodes: Array<{
    id: string;
    label: string;
    icon?: string;
    children?: Array<...>;
    expanded?: boolean;
    selected?: boolean;
  }>;
  selectable?: boolean;
  multiSelect?: boolean;
}
```

---

### `carousel`

Content carousel with autoplay and navigation controls.

```typescript
{
  items: Block[]; // Nested blocks
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
}
```

---

## Advanced Blocks

### `kv_card`

Single record display with up to 30 labelled fields.

```typescript
{
  title: string;
  subtitle?: string;
  fields: Array<{
    label: string;
    value: string;
    type?: 'text' | 'badge' | 'link';
    href?: string;
  }>;
}
```

Only `http(s)` and `mailto:` hrefs render as clickable anchors.

---

### `badge_group`

Collection of badges/tags with variants.

```typescript
{
  title?: string;
  badges: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    icon?: string;
  }>;
  layout?: 'row' | 'wrap';
}
```

---

### `json_viewer`

Collapsible JSON tree with syntax highlighting.

```typescript
{
  data: unknown;
  title?: string;
  initialExpanded?: boolean;
  maxDepth?: number;
  searchable?: boolean;
}
```

---

### `diff_viewer`

Side-by-side or inline code diff view.

```typescript
{
  original: string;
  modified: string;
  language?: string;
  filename?: string;
  viewMode?: 'split' | 'unified';
  showLineNumbers?: boolean;
}
```

---

### `kanban`

Read-only kanban board with columns and cards.

```typescript
{
  columns: Array<{
    id: string;
    title: string;
    cards: Array<{
      id: string;
      title: string;
      description?: string;
      tags?: string[];
      assignee?: string;
    }>;
  }>;
  showCardCount?: boolean;
}
```

---

### `notice`

Info / success / warning / error banner. Also the **fallback** block produced by the normalizer for any unknown or invalid LLM output.

```typescript
{
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;  // <= 2000 chars
}
```

---

## Adding a New Block

1. Add the Zod schema in `packages/types/src/blocks/<name>.ts`
2. Export from `packages/types/src/blocks/index.ts`
3. Add a `BlockDefinition` in `packages/core/src/registry/blocks/<name>.ts`
4. Add to `BUILTIN_BLOCKS` in `packages/core/src/registry/defaults.ts`
5. Add React component in `packages/react/src/blocks/<Name>Block.tsx`
6. Register in `packages/react/src/registry.tsx`
7. Add Vue component in `packages/vue/src/components/blocks/<Name>Block.vue`
8. Export from `packages/vue/src/index.ts`
9. Document and add tests
