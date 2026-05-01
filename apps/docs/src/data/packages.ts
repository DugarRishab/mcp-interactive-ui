export interface PackageMeta {
  id: string;
  name: string;
  description: string;
  install: string;
  icon: string;
  color: string;
  whenToUse: string[];
  quickStart: {
    title: string;
    code: string;
  };
  concepts: Array<{
    title: string;
    description: string;
    code?: string;
  }>;
  exports: Array<{
    name: string;
    type: "function" | "type" | "class" | "const" | "component";
    signature: string;
    description: string;
    example?: string;
  }>;
  examples: Array<{
    title: string;
    description: string;
    code: string;
  }>;
  typescript: {
    description: string;
    generics?: Array<{
      name: string;
      constraint?: string;
      description: string;
    }>;
    tips: string[];
  };
  configuration?: {
    description: string;
    options: Array<{
      name: string;
      type: string;
      default?: string;
      description: string;
    }>;
  };
  troubleshooting: Array<{
    problem: string;
    solution: string;
  }>;
}

export const packagesMeta: Record<string, PackageMeta> = {
  types: {
    id: "types",
    name: "@mcp-interactive-ui/types",
    description: "TypeScript types and Zod schemas for all blocks and responses. This is the foundation package that defines the data structures used across the entire ecosystem.",
    install: "npm install @mcp-interactive-ui/types",
    icon: "FileType",
    color: "blue",
    whenToUse: [
      "Building custom block implementations",
      "Creating your own renderer",
      "Validating LLM responses",
      "TypeScript projects needing block types"
    ],
    quickStart: {
      title: "Import and Use Types",
      code: `import { dataTableDataSchema, type DataTableData } from '@mcp-interactive-ui/types';

// Validate data
const result = dataTableDataSchema.safeParse(myData);

// Use types
const tableData: DataTableData = {
  columns: [{ key: "name", header: "Name" }],
  rows: [{ name: "John" }]
};`
    },
    concepts: [
      {
        title: "Zod Schemas",
        description: "Every block has a corresponding Zod schema for runtime validation. Schema names follow the pattern `{blockName}DataSchema`.",
        code: `import { formInputDataSchema } from '@mcp-interactive-ui/types';

// Validate at runtime
const validated = formInputDataSchema.parse(unknownData);`
      },
      {
        title: "Type Inference",
        description: "Derive TypeScript types from Zod schemas using `z.infer<typeof schema>`.",
        code: `import { dataTableDataSchema } from '@mcp-interactive-ui/types';
import type { z } from 'zod';

type DataTableData = z.infer<typeof dataTableDataSchema>;`
      },
      {
        title: "BlockType Enum",
        description: "The `BlockType` type is a union of all valid block type strings.",
        code: `import type { BlockType } from '@mcp-interactive-ui/types';

const blockType: BlockType = "data_table"; // ✓ Valid
const invalid: BlockType = "unknown";      // ✗ Type error`
      },
      {
        title: "NormalizedBlock Union",
        description: "`NormalizedBlock` is a discriminated union of all block types, useful for generic block handling."
      }
    ],
    exports: [
      { name: "BlockType", type: "type", signature: "type BlockType = 'data_table' | 'kv_card' | ...", description: "Union type of all valid block identifiers" },
      { name: "NormalizedBlock", type: "type", signature: "type NormalizedBlock = ...", description: "Discriminated union of all block shapes" },
      { name: "NormalizedAIResponse", type: "type", signature: "type NormalizedAIResponse = ...", description: "Standard response wrapper type" },
      { name: "BlockDefinition", type: "type", signature: "type BlockDefinition = ...", description: "Block registration definition type" },
      { name: "blockTypeSchema", type: "const", signature: "const blockTypeSchema: z.ZodEnum<...>", description: "Zod enum schema for block types" },
      { name: "normalizedBlockSchema", type: "const", signature: "const normalizedBlockSchema: z.ZodType<...>", description: "Zod schema for normalized blocks" },
      { name: "dataTableDataSchema", type: "const", signature: "const dataTableDataSchema: z.ZodType<...>", description: "Schema for data_table block", example: `dataTableDataSchema.parse(data)` },
      { name: "kvCardDataSchema", type: "const", signature: "const kvCardDataSchema: z.ZodType<...>", description: "Schema for kv_card block" },
      { name: "statGroupDataSchema", type: "const", signature: "const statGroupDataSchema: z.ZodType<...>", description: "Schema for stat_group block" },
      { name: "noticeDataSchema", type: "const", signature: "const noticeDataSchema: z.ZodType<...>", description: "Schema for notice block" },
      { name: "markdownDataSchema", type: "const", signature: "const markdownDataSchema: z.ZodType<...>", description: "Schema for markdown block" },
      { name: "formInputDataSchema", type: "const", signature: "const formInputDataSchema: z.ZodType<...>", description: "Schema for form_input block" },
      { name: "buttonGroupDataSchema", type: "const", signature: "const buttonGroupDataSchema: z.ZodType<...>", description: "Schema for button_group block" },
      { name: "MAX_TABLE_ROWS", type: "const", signature: "const MAX_TABLE_ROWS = 500", description: "Maximum rows for data_table" },
      { name: "MAX_TABLE_COLUMNS", type: "const", signature: "const MAX_TABLE_COLUMNS = 20", description: "Maximum columns for data_table" }
    ],
    examples: [
      {
        title: "Validate Response",
        description: "Validate an AI response against the schema",
        code: `import { normalizedBlockSchema } from '@mcp-interactive-ui/types';

const response = {
  type: "data_table",
  id: "table-1",
  data: { columns: [...], rows: [...] }
};

const result = normalizedBlockSchema.safeParse(response);
if (result.success) {
  console.log("Valid block:", result.data);
} else {
  console.error("Validation failed:", result.error);
}`
      },
      {
        title: "Type-Safe Block Handler",
        description: "Create a type-safe switch for handling different blocks",
        code: `import type { NormalizedBlock, BlockType } from '@mcp-interactive-ui/types';

function renderBlock(block: NormalizedBlock) {
  switch (block.type) {
    case "data_table":
      return renderTable(block.data);  // Fully typed
    case "kv_card":
      return renderCard(block.data);   // Fully typed
    // ...
  }
}`
      },
      {
        title: "Custom Block Type",
        description: "Extend with your own block types",
        code: `import type { BlockBase } from '@mcp-interactive-ui/types';

interface MyCustomBlock extends BlockBase {
  type: "my_custom";
  data: { myField: string };
}

type MyBlocks = NormalizedBlock | MyCustomBlock;`
      }
    ],
    typescript: {
      description: "The types package provides strict TypeScript definitions that enable compile-time safety and IDE autocompletion.",
      generics: [
        { name: "BlockDataByType", description: "Mapped type from block type to data shape" },
        { name: "T", constraint: "extends BlockType", description: "Generic block type parameter" }
      ],
      tips: [
        "Use `satisfies` keyword for extra type safety: `const data = {...} satisfies DataTableData`",
        "Enable strict mode in tsconfig.json for best results",
        "Use discriminated unions with `type` field for type narrowing"
      ]
    },
    troubleshooting: [
      { problem: "Zod validation errors are cryptic", solution: "Use `.safeParse()` instead of `.parse()` to get detailed error objects without throwing" },
      { problem: "Type imports not working", solution: "Use `import type { ... }` syntax for type-only imports to avoid bundling issues" },
      { problem: "Block type not recognized", solution: "Ensure you're using a valid BlockType value from the enum, not just any string" }
    ]
  },

  core: {
    id: "core",
    name: "@mcp-interactive-ui/core",
    description: "Core registry, validation, and normalization logic. Includes OpenAI adapter for tool-based rendering. The engine behind the UI blocks.",
    install: "npm install @mcp-interactive-ui/core",
    icon: "Cpu",
    color: "emerald",
    whenToUse: [
      "Building server-side LLM integrations",
      "Creating custom registries",
      "Validating AI responses",
      "Using OpenAI function calling"
    ],
    quickStart: {
      title: "Build and Use Registry",
      code: `import { buildRegistry, registerBlock } from '@mcp-interactive-ui/core';
import { dataTableBlock } from '@mcp-interactive-ui/core';

// Build with default blocks
const registry = buildRegistry([dataTableBlock, kvCardBlock]);

// Validate a block
const result = registry.validate({
  type: "data_table",
  data: { ... }
});`
    },
    concepts: [
      {
        title: "Block Registry",
        description: "The registry is a collection of block definitions with validation and metadata. It's the central source of truth for what blocks are available.",
        code: `const registry = buildRegistry([
  dataTableBlock,
  kvCardBlock,
  // ... more blocks
]);`
      },
      {
        title: "Validation",
        description: "Validate blocks against their schemas with detailed error reporting.",
        code: `import { validateBlock } from '@mcp-interactive-ui/core';

const result = validateBlock({
  type: "data_table",
  data: { ... }
}, registry);

if (!result.valid) {
  console.log(result.issues); // Detailed errors
}`
      },
      {
        title: "Normalization",
        description: "Convert raw LLM responses to normalized block format with error recovery.",
        code: `import { normalizeLLMResponse } from '@mcp-interactive-ui/core';

const normalized = normalizeLLMResponse({
  blocks: rawBlocks,
  errors: "replace-with-notice" // or "filter", "throw"
});`
      },
      {
        title: "OpenAI Adapter",
        description: "Convert registry to OpenAI function definitions for tool-based rendering.",
        code: `import { registryToOpenAITools } from '@mcp-interactive-ui/core';

const tools = registryToOpenAITools(registry);
// Use with openai.chat.completions.create({ tools })`
      }
    ],
    exports: [
      { name: "buildRegistry", type: "function", signature: "function buildRegistry(blocks: BlockDefinition[]): FrozenRegistry", description: "Create an immutable registry from block definitions", example: `const registry = buildRegistry([dataTableBlock])` },
      { name: "registerBlock", type: "function", signature: "function registerBlock(def: BlockDefinition): void", description: "Register a single block to the default registry" },
      { name: "getDefaultRegistry", type: "function", signature: "function getDefaultRegistry(): FrozenRegistry", description: "Get the default global registry" },
      { name: "validateBlock", type: "function", signature: "function validateBlock(block: unknown, registry: FrozenRegistry): ValidateBlockResult", description: "Validate a block against registry", example: `const { valid, issues } = validateBlock(data, registry)` },
      { name: "validateAction", type: "function", signature: "function validateAction(action: unknown, options: ValidateActionOptions): boolean", description: "Validate a block action" },
      { name: "normalizeLLMResponse", type: "function", signature: "function normalizeLLMResponse(response: RawAIResponse, options?: NormalizeOptions): NormalizedAIResponse", description: "Normalize and validate LLM response", example: `const normalized = normalizeLLMResponse(raw)` },
      { name: "registryToOpenAITools", type: "function", signature: "function registryToOpenAITools(registry: FrozenRegistry): OpenAIChatTool[]", description: "Convert registry to OpenAI tools format", example: `const tools = registryToOpenAITools(registry)` },
      { name: "parseOpenAIToolCalls", type: "function", signature: "function parseOpenAIToolCalls(message: OpenAIAssistantMessage): OpenAIToolCall[]", description: "Extract tool calls from OpenAI response" },
      { name: "BUILTIN_BLOCKS", type: "const", signature: "const BUILTIN_BLOCKS: BlockDefinition[]", description: "Array of all built-in block definitions" },
      { name: "FrozenRegistry", type: "type", signature: "type FrozenRegistry = { ... }", description: "Immutable registry type" },
      { name: "ValidateBlockResult", type: "type", signature: "type ValidateBlockResult = { valid: boolean; issues: ValidationIssue[] }", description: "Block validation result type" },
      { name: "RENDER_TOOL_NAME", type: "const", signature: "const RENDER_TOOL_NAME = 'render_ui'", description: "Default OpenAI tool name" }
    ],
    examples: [
      {
        title: "Custom Registry",
        description: "Create a registry with only specific blocks",
        code: `import { buildRegistry } from '@mcp-interactive-ui/core';
import { dataTableBlock, noticeBlock } from '@mcp-interactive-ui/core';

const limitedRegistry = buildRegistry([
  dataTableBlock,
  noticeBlock
  // Only these blocks allowed
]);`
      },
      {
        title: "OpenAI Integration",
        description: "Use with OpenAI function calling",
        code: `import OpenAI from 'openai';
import { registryToOpenAITools, parseOpenAIToolCalls } from '@mcp-interactive-ui/core';

const openai = new OpenAI();
const registry = buildRegistry(BUILTIN_BLOCKS);

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Show me sales data" }],
  tools: registryToOpenAITools(registry)
});

const calls = parseOpenAIToolCalls(completion.choices[0].message);`
      },
      {
        title: "Custom Block Registration",
        description: "Add your own blocks to the registry",
        code: `import { registerBlock, buildRegistry } from '@mcp-interactive-ui/core';
import { myCustomBlock } from './my-block';

registerBlock(myCustomBlock);
const registry = buildRegistry([...BUILTIN_BLOCKS, myCustomBlock]);`
      }
    ],
    typescript: {
      description: "Core provides generic utilities for block handling.",
      generics: [
        { name: "T", constraint: "extends BlockType", description: "Block type for type-safe operations" }
      ],
      tips: [
        "Use `FrozenRegistry` type when passing registries between functions",
        "Validation results include detailed issue paths for debugging",
        "OpenAI tools include full JSON schemas for function calling"
      ]
    },
    configuration: {
      description: "Normalization options control error handling behavior.",
      options: [
        { name: "errors", type: "'replace-with-notice' | 'filter' | 'throw'", default: "'replace-with-notice'", description: "How to handle validation errors" },
        { name: "telemetry", type: "boolean", default: "false", description: "Enable validation telemetry" }
      ]
    },
    troubleshooting: [
      { problem: "Registry is immutable but needs updating", solution: "Create a new registry with `buildRegistry()` - registries are intentionally immutable" },
      { problem: "OpenAI tools not being called", solution: "Ensure your prompt clearly instructs the model to use the render_ui function" },
      { problem: "Validation passes but rendering fails", solution: "Check that your React/Vue components match the data schemas exactly" }
    ]
  },

  react: {
    id: "react",
    name: "@mcp-interactive-ui/react",
    description: "React components for rendering all block types with theming support. Includes 25+ block components and a theme system.",
    install: "npm install @mcp-interactive-ui/react",
    icon: "Component",
    color: "cyan",
    whenToUse: [
      "Building React applications",
      "Need pre-built block components",
      "Want theme customization",
      "Using Next.js, Vite, or CRA"
    ],
    quickStart: {
      title: "Render AI Content",
      code: `import { RenderAIContent } from '@mcp-interactive-ui/react';

function ChatMessage({ response }) {
  return (
    <RenderAIContent
      response={response}
      onBlockAction={(action, payload) => {
        console.log('Action:', action, payload);
      }}
    />
  );
}`
    },
    concepts: [
      {
        title: "RenderAIContent",
        description: "The main component that renders a normalized AI response with all blocks.",
        code: `<RenderAIContent
  response={normalizedResponse}
  onBlockAction={handleAction}
  theme={customTheme}
/>`
      },
      {
        title: "Individual Blocks",
        description: "Use individual block components for specific rendering needs.",
        code: `import { DataTableBlock, NoticeBlock } from '@mcp-interactive-ui/react';

<DataTableBlock data={tableData} />
<NoticeBlock data={noticeData} />`
      },
      {
        title: "Theme System",
        description: "Customize the look with the built-in theme provider and presets.",
        code: `import { ThemeProvider, lightTheme } from '@mcp-interactive-ui/react';

<ThemeProvider theme={lightTheme}>
  <RenderAIContent ... />
</ThemeProvider>`
      },
      {
        title: "Block Actions",
        description: "Handle user interactions like form submissions and button clicks.",
        code: `<RenderAIContent
  response={response}
  onBlockAction={(action, payload) => {
    if (action === 'form_submit') {
      saveData(payload);
    }
  }}
/>`
      }
    ],
    exports: [
      { name: "RenderAIContent", type: "component", signature: "function RenderAIContent(props: RenderAIContentProps): JSX.Element", description: "Main component for rendering AI responses", example: `<RenderAIContent response={data} />` },
      { name: "DataTableBlock", type: "component", signature: "function DataTableBlock(props: DataTableBlockProps): JSX.Element", description: "Data table component" },
      { name: "KVCardBlock", type: "component", signature: "function KVCardBlock(props: KVCardBlockProps): JSX.Element", description: "Key-value card component" },
      { name: "StatGroupBlock", type: "component", signature: "function StatGroupBlock(props: StatGroupBlockProps): JSX.Element", description: "Stat group component" },
      { name: "NoticeBlock", type: "component", signature: "function NoticeBlock(props: NoticeBlockProps): JSX.Element", description: "Notice/alert component" },
      { name: "MarkdownBlock", type: "component", signature: "function MarkdownBlock(props: MarkdownBlockProps): JSX.Element", description: "Markdown renderer component" },
      { name: "FormInputBlock", type: "component", signature: "function FormInputBlock(props: FormInputBlockProps): JSX.Element", description: "Form builder component" },
      { name: "ButtonGroupBlock", type: "component", signature: "function ButtonGroupBlock(props: ButtonGroupBlockProps): JSX.Element", description: "Button group component" },
      { name: "TabsBlock", type: "component", signature: "function TabsBlock(props: TabsBlockProps): JSX.Element", description: "Tabs component" },
      { name: "AccordionBlock", type: "component", signature: "function AccordionBlock(props: AccordionBlockProps): JSX.Element", description: "Accordion component" },
      { name: "ModalBlock", type: "component", signature: "function ModalBlock(props: ModalBlockProps): JSX.Element", description: "Modal/dialog component" },
      { name: "ProgressBlock", type: "component", signature: "function ProgressBlock(props: ProgressBlockProps): JSX.Element", description: "Progress indicator component" },
      { name: "ChartBlock", type: "component", signature: "function ChartBlock(props: ChartBlockProps): JSX.Element", description: "Chart visualization component" },
      { name: "CodeBlock", type: "component", signature: "function CodeBlock(props: CodeBlockProps): JSX.Element", description: "Code display component" },
      { name: "TimelineBlock", type: "component", signature: "function TimelineBlock(props: TimelineBlockProps): JSX.Element", description: "Timeline component" },
      { name: "GalleryBlock", type: "component", signature: "function GalleryBlock(props: GalleryBlockProps): JSX.Element", description: "Image gallery component" },
      { name: "ListBlock", type: "component", signature: "function ListBlock(props: ListBlockProps): JSX.Element", description: "List component" },
      { name: "BreadcrumbBlock", type: "component", signature: "function BreadcrumbBlock(props: BreadcrumbBlockProps): JSX.Element", description: "Breadcrumb navigation component" },
      { name: "BadgeGroupBlock", type: "component", signature: "function BadgeGroupBlock(props: BadgeGroupBlockProps): JSX.Element", description: "Badge group component" },
      { name: "MetricCardBlock", type: "component", signature: "function MetricCardBlock(props: MetricCardBlockProps): JSX.Element", description: "Metric card component" },
      { name: "ComparisonTableBlock", type: "component", signature: "function ComparisonTableBlock(props: ComparisonTableBlockProps): JSX.Element", description: "Comparison table component" },
      { name: "JsonViewerBlock", type: "component", signature: "function JsonViewerBlock(props: JsonViewerBlockProps): JSX.Element", description: "JSON viewer component" },
      { name: "DiffViewerBlock", type: "component", signature: "function DiffViewerBlock(props: DiffViewerBlockProps): JSX.Element", description: "Diff viewer component" },
      { name: "KanbanBlock", type: "component", signature: "function KanbanBlock(props: KanbanBlockProps): JSX.Element", description: "Kanban board component" },
      { name: "TreeBlock", type: "component", signature: "function TreeBlock(props: TreeBlockProps): JSX.Element", description: "Tree view component" },
      { name: "CarouselBlock", type: "component", signature: "function CarouselBlock(props: CarouselBlockProps): JSX.Element", description: "Carousel component" },
      { name: "ThemeProvider", type: "component", signature: "function ThemeProvider(props: ThemeProviderProps): JSX.Element", description: "Theme context provider" },
      { name: "useTheme", type: "function", signature: "function useTheme(): ThemeContext", description: "Hook to access theme context" },
      { name: "lightTheme", type: "const", signature: "const lightTheme: ThemeConfig", description: "Default light theme preset" },
      { name: "darkTheme", type: "const", signature: "const darkTheme: ThemeConfig", description: "Default dark theme preset" },
      { name: "presetThemes", type: "const", signature: "const presetThemes: Record<string, ThemeConfig>", description: "All preset themes" },
      { name: "defaultBlockComponents", type: "const", signature: "const defaultBlockComponents: BlockComponentMap", description: "Map of block types to components" },
      { name: "NestedBlockRenderer", type: "component", signature: "function NestedBlockRenderer(props: NestedBlockRendererProps): JSX.Element", description: "Renders blocks within other blocks" }
    ],
    examples: [
      {
        title: "Basic Usage",
        description: "Render a complete AI response",
        code: `import { RenderAIContent } from '@mcp-interactive-ui/react';

function App() {
  const response = {
    blocks: [
      { type: "notice", id: "n1", data: { variant: "info", message: "Hello!" } }
    ]
  };

  return <RenderAIContent response={response} />;
}`
      },
      {
        title: "With Theme",
        description: "Apply a custom theme",
        code: `import { ThemeProvider, darkTheme } from '@mcp-interactive-ui/react';

<ThemeProvider theme={darkTheme}>
  <RenderAIContent response={response} />
</ThemeProvider>`
      },
      {
        title: "Handle Actions",
        description: "Respond to user interactions",
        code: `<RenderAIContent
  response={response}
  onBlockAction={(action, payload) => {
    switch (action) {
      case 'submit':
        handleSubmit(payload);
        break;
      case 'button_click':
        handleButton(payload);
        break;
    }
  }}
/>`
      }
    ],
    typescript: {
      description: "All components are fully typed with props interfaces.",
      tips: [
        "Component props extend from base types in @mcp-interactive-ui/types",
        "Use `BlockComponentProps<T>` for custom block implementations",
        "ThemeConfig type enables strict theme customization"
      ]
    },
    troubleshooting: [
      { problem: "Styles not applying", solution: "Ensure Tailwind CSS is configured and @mcp-interactive-ui/react styles are imported" },
      { problem: "Components not rendering", solution: "Check that block data matches the expected schema exactly" },
      { problem: "Theme changes not reflecting", solution: "Make sure ThemeProvider wraps your component tree" }
    ]
  },

  vue: {
    id: "vue",
    name: "@mcp-interactive-ui/vue",
    description: "Vue 3 components and composables for rendering blocks. Provides a similar API to the React package with Vue-specific patterns.",
    install: "npm install @mcp-interactive-ui/vue",
    icon: "Layers",
    color: "green",
    whenToUse: [
      "Building Vue 3 applications",
      "Prefer Vue over React",
      "Need Composition API support",
      "Using Nuxt or Vite with Vue"
    ],
    quickStart: {
      title: "Use Composable",
      code: `<script setup>
import { useAIContent } from '@mcp-interactive-ui/vue';

const { render } = useAIContent();
<\/script>

<template>
  <div v-html="render(response)" />
</template>`
    },
    concepts: [
      {
        title: "useAIContent Composable",
        description: "Main composable for rendering AI responses in Vue.",
        code: `const { render, registry } = useAIContent({
  onAction: (action, payload) => console.log(action, payload)
});`
      },
      {
        title: "useBlockRegistry",
        description: "Access and customize the block registry.",
        code: `const registry = useBlockRegistry();
registry.register(customBlock);`
      },
      {
        title: "Individual Components",
        description: "Use specific block components directly.",
        code: `<DataTableBlock :data="tableData" />
<NoticeBlock :data="noticeData" />`
      }
    ],
    exports: [
      { name: "useAIContent", type: "function", signature: "function useAIContent(options?: UseAIContentOptions): UseAIContentReturn", description: "Main composable for rendering", example: `const { render } = useAIContent()` },
      { name: "useBlockRegistry", type: "function", signature: "function useBlockRegistry(): BlockRegistry", description: "Registry composable" },
      { name: "DataTableBlock", type: "component", signature: "Component", description: "Vue data table component" },
      { name: "KVCardBlock", type: "component", signature: "Component", description: "Vue key-value card component" },
      { name: "StatGroupBlock", type: "component", signature: "Component", description: "Vue stat group component" },
      { name: "NoticeBlock", type: "component", signature: "Component", description: "Vue notice component" },
      { name: "MarkdownBlock", type: "component", signature: "Component", description: "Vue markdown component" },
      { name: "FormInputBlock", type: "component", signature: "Component", description: "Vue form component" },
      { name: "ButtonGroupBlock", type: "component", signature: "Component", description: "Vue button group component" },
      { name: "TabsBlock", type: "component", signature: "Component", description: "Vue tabs component" },
      { name: "defaultBlockComponents", type: "const", signature: "const defaultBlockComponents: Record<BlockType, Component>", description: "Map of block types to Vue components" }
    ],
    examples: [
      {
        title: "Basic Setup",
        description: "Render blocks in Vue",
        code: `<script setup>
import { useAIContent } from '@mcp-interactive-ui/vue';

const { render } = useAIContent();
const response = ref({ blocks: [...] });
<\/script>

<template>
  <component :is="render(response)" />
</template>`
      },
      {
        title: "Handle Actions",
        description: "Respond to block actions",
        code: `const { render } = useAIContent({
  onAction: (action, payload) => {
    if (action === 'submit') {
      saveForm(payload);
    }
  }
});`
      }
    ],
    typescript: {
      description: "Full TypeScript support with Vue 3.",
      tips: [
        "Use with <script setup> for best experience",
        "Type inference works with ref() and reactive()",
        "Props are fully typed with generics"
      ]
    },
    troubleshooting: [
      { problem: "Components not rendering", solution: "Ensure Vue 3 is installed (not Vue 2)" },
      { problem: "Types not recognized", solution: "Add @mcp-interactive-ui/types to your tsconfig paths" }
    ]
  },

  server: {
    id: "server",
    name: "@mcp-interactive-ui/server",
    description: "MCP (Model Context Protocol) server implementation for Claude Desktop and other MCP clients. Exposes blocks as tools.",
    install: "npm install @mcp-interactive-ui/server",
    icon: "Server",
    color: "purple",
    whenToUse: [
      "Building MCP servers",
      "Integrating with Claude Desktop",
      "Exposing blocks as tools",
      "Server-side AI orchestration"
    ],
    quickStart: {
      title: "Create MCP Server",
      code: `import { createServer, registerTool } from '@mcp-interactive-ui/server';

const server = createServer({ name: "my-app", version: "1.0.0" });

registerTool(server, {
  name: "get_user_data",
  handler: async () => ({
    blocks: [{ type: "kv_card", id: "user", data: { ... } }]
  })
});

server.start();`
    },
    concepts: [
      {
        title: "MCP Server",
        description: "Create a Model Context Protocol server that exposes tools to AI clients.",
        code: `const server = createServer({
  name: "my-server",
  version: "1.0.0"
});`
      },
      {
        title: "Tools",
        description: "Register tools that return UI blocks as responses.",
        code: `registerTool(server, {
  name: "show_dashboard",
  description: "Display analytics dashboard",
  handler: async (args) => ({
    blocks: [dashboardBlock]
  })
});`
      }
    ],
    exports: [
      { name: "createServer", type: "function", signature: "function createServer(config: ServerConfig): MCPServer", description: "Create MCP server instance", example: `const server = createServer({ name: "app", version: "1.0.0" })` },
      { name: "registerTool", type: "function", signature: "function registerTool(server: MCPServer, tool: ToolConfig): void", description: "Register a tool with the server" },
      { name: "createBlockTool", type: "function", signature: "function createBlockTool(block: BlockDefinition): ToolConfig", description: "Convert block to MCP tool" },
      { name: "MCPServer", type: "type", signature: "type MCPServer = { ... }", description: "MCP server type" },
      { name: "ToolConfig", type: "type", signature: "type ToolConfig = { name: string; handler: Function }", description: "Tool configuration type" }
    ],
    examples: [
      {
        title: "Claude Desktop Config",
        description: "Configure for Claude Desktop",
        code: `// claude_desktop_config.json
{
  "mcpServers": {
    "my-app": {
      "command": "npx",
      "args": ["-y", "@mcp-interactive-ui/server"]
    }
  }
}`
      }
    ],
    typescript: {
      description: "Server package is built for Node.js environments.",
      tips: [
        "Only works in Node.js, not browsers",
        "Requires MCP client (Claude Desktop, etc.)",
        "Tools must return valid block data"
      ]
    },
    troubleshooting: [
      { problem: "Server not connecting", solution: "Check MCP client configuration and server logs" },
      { problem: "Tools not appearing", solution: "Ensure tool names are unique and descriptions are clear" }
    ]
  },

  langchain: {
    id: "langchain",
    name: "@mcp-interactive-ui/langchain",
    description: "LangChain adapter for using UI blocks with LangChain agents and chains.",
    install: "npm install @mcp-interactive-ui/langchain",
    icon: "Link",
    color: "orange",
    whenToUse: [
      "Using LangChain.js",
      "Building agent workflows",
      "Creating chains with UI output",
      "Tool-based agents"
    ],
    quickStart: {
      title: "Create Tool",
      code: `import { createRenderTool } from '@mcp-interactive-ui/langchain';
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI();
const renderTool = createRenderTool(registry);

const agent = await initializeAgentExecutorWithOptions(
  [renderTool],
  model
);`
    },
    concepts: [
      {
        title: "Render Tool",
        description: "Create a LangChain tool that renders UI blocks.",
        code: `const renderTool = createRenderTool(registry, {
  name: "render_ui",
  description: "Render UI blocks to the user"
});`
      }
    ],
    exports: [
      { name: "createRenderTool", type: "function", signature: "function createRenderTool(registry: FrozenRegistry, options?: ToolOptions): StructuredTool", description: "Create LangChain tool", example: `const tool = createRenderTool(registry)` },
      { name: "blocksToLangChainMessages", type: "function", signature: "function blocksToLangChainMessages(blocks: NormalizedBlock[]): BaseMessage[]", description: "Convert blocks to LangChain messages" }
    ],
    examples: [
      {
        title: "Agent with UI",
        description: "Create an agent that can render UI",
        code: `import { createRenderTool } from '@mcp-interactive-ui/langchain';

const tools = [createRenderTool(registry)];
const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });`
      }
    ],
    typescript: {
      description: "Integrates with LangChain.js TypeScript types.",
      tips: [
        "Compatible with all LangChain agent types",
        "Returns LangChain message format",
        "Integrates with tool-calling agents"
      ]
    },
    troubleshooting: [
      { problem: "Tool not being called", solution: "Ensure prompt instructs agent to use render_ui tool" },
      { problem: "Incompatible with agent", solution: "Use function-calling compatible agents (OpenAI Functions, etc.)" }
    ]
  },

  anthropic: {
    id: "anthropic",
    name: "@mcp-interactive-ui/anthropic",
    description: "Anthropic SDK adapter for Claude models. Converts blocks to Anthropic tool format.",
    install: "npm install @mcp-interactive-ui/anthropic",
    icon: "Sparkles",
    color: "amber",
    whenToUse: [
      "Using Anthropic Claude API",
      "Direct SDK integration",
      "Non-LangChain Claude usage",
      "Tool use with Claude"
    ],
    quickStart: {
      title: "Use with Anthropic SDK",
      code: `import Anthropic from '@anthropic-ai/sdk';
import { registryToAnthropicTools } from '@mcp-interactive-ui/anthropic';

const anthropic = new Anthropic();
const tools = registryToAnthropicTools(registry);

const response = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  tools
});`
    },
    concepts: [
      {
        title: "Tool Conversion",
        description: "Convert registry to Anthropic tool definitions.",
        code: `const tools = registryToAnthropicTools(registry);`
      }
    ],
    exports: [
      { name: "registryToAnthropicTools", type: "function", signature: "function registryToAnthropicTools(registry: FrozenRegistry): AnthropicTool[]", description: "Convert to Anthropic format", example: `const tools = registryToAnthropicTools(registry)` },
      { name: "parseAnthropicToolUse", type: "function", signature: "function parseAnthropicToolUse(response: Message): ToolUseBlock[]", description: "Extract tool uses from response" },
      { name: "AnthropicTool", type: "type", signature: "type AnthropicTool = { ... }", description: "Anthropic tool type" }
    ],
    examples: [
      {
        title: "Claude Integration",
        description: "Use with Claude API",
        code: `const tools = registryToAnthropicTools(registry);
const response = await anthropic.messages.create({
  model: "claude-3-opus",
  messages: [{ role: "user", content: "Show me data" }],
  tools
});`
      }
    ],
    typescript: {
      description: "Types match Anthropic SDK types.",
      tips: [
        "Compatible with @anthropic-ai/sdk",
        "Works with Claude 3 models",
        "Supports tool use streaming"
      ]
    },
    troubleshooting: [
      { problem: "Tools not recognized", solution: "Ensure using Claude 3 models that support tools" },
      { problem: "Schema errors", solution: "Anthropic has stricter tool schemas - check type compatibility" }
    ]
  },

  testing: {
    id: "testing",
    name: "@mcp-interactive-ui/testing",
    description: "Mock generators, test utilities, and validators for testing block-based applications.",
    install: "npm install -D @mcp-interactive-ui/testing",
    icon: "TestTube",
    color: "pink",
    whenToUse: [
      "Writing unit tests",
      "Generating mock data",
      "E2E testing",
      "Storybook stories"
    ],
    quickStart: {
      title: "Generate Mock Data",
      code: `import { generateMockDataTable, generateMockResponse } from '@mcp-interactive-ui/testing';

// Generate table data
const tableData = generateMockDataTable({ rows: 10 });

// Generate full response
const response = generateMockResponse(['data_table', 'notice']);`
    },
    concepts: [
      {
        title: "Mock Generators",
        description: "Generate realistic mock data for any block type.",
        code: `generateMockDataTable({ rows: 5, columns: 3 })
generateMockFormInput({ fields: 4 })
generateMockStatGroup({ items: 3 })`
      },
      {
        title: "Validators",
        description: "Test helpers for validating block rendering.",
        code: `expectBlockToRender(block);
expectValidSchema(data, 'data_table');`
      }
    ],
    exports: [
      { name: "generateMockDataTable", type: "function", signature: "function generateMockDataTable(options?: MockOptions): DataTableData", description: "Generate mock table data", example: `generateMockDataTable({ rows: 10 })` },
      { name: "generateMockKVCard", type: "function", signature: "function generateMockKVCard(): KVCardData", description: "Generate mock card data" },
      { name: "generateMockStatGroup", type: "function", signature: "function generateMockStatGroup(options?: { items?: number }): StatGroupData", description: "Generate mock stat data" },
      { name: "generateMockNotice", type: "function", signature: "function generateMockNotice(variant?: NoticeVariant): NoticeData", description: "Generate mock notice data" },
      { name: "generateMockMarkdown", type: "function", signature: "function generateMockMarkdown(): MarkdownData", description: "Generate mock markdown data" },
      { name: "generateMockFormInput", type: "function", signature: "function generateMockFormInput(options?: { fields?: number }): FormInputData", description: "Generate mock form data" },
      { name: "generateMockResponse", type: "function", signature: "function generateMockResponse(blockTypes: BlockType[]): NormalizedAIResponse", description: "Generate full mock response", example: `generateMockResponse(['data_table', 'notice'])` },
      { name: "expectValidSchema", type: "function", signature: "function expectValidSchema(data: unknown, blockType: BlockType): void", description: "Jest expectation helper" },
      { name: "expectBlockToRender", type: "function", signature: "function expectBlockToRender(block: NormalizedBlock): void", description: "Test block rendering" }
    ],
    examples: [
      {
        title: "Unit Test",
        description: "Test component with mock data",
        code: `import { generateMockDataTable } from '@mcp-interactive-ui/testing';
import { DataTableBlock } from '@mcp-interactive-ui/react';

test('renders table', () => {
  const data = generateMockDataTable({ rows: 5 });
  render(<DataTableBlock data={data} />);
  expect(screen.getByRole('table')).toBeInTheDocument();
});`
      },
      {
        title: "Storybook",
        description: "Create stories with variations",
        code: `import { generateMockNotice } from '@mcp-interactive-ui/testing';

export const Info = {
  args: {
    data: generateMockNotice('info')
  }
};`
      }
    ],
    typescript: {
      description: "Test utilities are fully typed.",
      tips: [
        "Use as devDependency",
        "Mock options are typed per block",
        "Validators work with Jest and Vitest"
      ]
    },
    troubleshooting: [
      { problem: "Mocks not realistic enough", solution: "Combine generators with your own data for specific scenarios" },
      { problem: "Tests fail in CI", solution: "Mocks are deterministic - ensure consistent test data" }
    ]
  }
};

export const packageOrder = [
  "types",
  "core",
  "react",
  "vue",
  "server",
  "langchain",
  "anthropic",
  "testing"
];
