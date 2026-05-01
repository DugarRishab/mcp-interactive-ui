import type { BlockType } from "@mcp-interactive-ui/types";

export type BlockCategory = "Data Display" | "Interactive" | "Content" | "Navigation" | "Advanced";
export type BlockPhase = 1 | 2 | 3;

export interface BlockMeta {
  id: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  phase: BlockPhase;
  icon: string;
  features: string[];
  useCases: string[];
  sampleData: unknown;
  sampleJson: string;
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
  }>;
  examples: Array<{
    title: string;
    description: string;
    code: string;
  }>;
}

export const blocksMeta: Record<BlockType, BlockMeta> = {
  data_table: {
    id: "data_table",
    name: "Data Table",
    description: "Display structured data in a responsive table with support for sorting, filtering, and various column types including text, numbers, currency, dates, and badges.",
    category: "Data Display",
    phase: 1,
    icon: "Table",
    features: [
      "Up to 20 columns and 500 rows",
      "Column types: text, number, currency, date, badge",
      "Responsive horizontal scroll on mobile",
      "Optional caption",
      "200 char limit per cell"
    ],
    useCases: [
      "Displaying query results from databases",
      "Showing lists of users, products, or orders",
      "Financial data with currency formatting",
      "Status dashboards with badge columns"
    ],
    sampleData: {
      columns: [
        { key: "name", header: "Name", type: "text" },
        { key: "role", header: "Role", type: "badge" },
        { key: "revenue", header: "Revenue", type: "currency" },
        { key: "active", header: "Active", type: "text" }
      ],
      rows: [
        { name: "Alice Johnson", role: "Admin", revenue: 125000, active: "Yes" },
        { name: "Bob Smith", role: "User", revenue: 85000, active: "Yes" },
        { name: "Carol White", role: "Editor", revenue: 92000, active: "No" }
      ],
      caption: "User revenue report Q4 2024"
    },
    sampleJson: `{
  "type": "data_table",
  "id": "users-table",
  "data": {
    "columns": [
      { "key": "name", "header": "Name", "type": "text" },
      { "key": "role", "header": "Role", "type": "badge" },
      { "key": "revenue", "header": "Revenue", "type": "currency" }
    ],
    "rows": [
      { "name": "Alice Johnson", "role": "Admin", "revenue": 125000 },
      { "name": "Bob Smith", "role": "User", "revenue": 85000 }
    ],
    "caption": "User revenue report"
  }
}`,
    props: [
      { name: "data", type: "DataTableData", required: true, description: "Table data with columns and rows" },
      { name: "onAction", type: "(action: string, payload: unknown) => void", required: false, description: "Callback when row actions are triggered" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Basic Table",
        description: "Simple data table with text columns",
        code: `<DataTableBlock data={{
  columns: [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" }
  ],
  rows: [
    { name: "John Doe", email: "john@example.com" }
  ]
}} />`
      },
      {
        title: "With Badges and Currency",
        description: "Table with formatted column types",
        code: `<DataTableBlock data={{
  columns: [
    { key: "product", header: "Product" },
    { key: "status", header: "Status", type: "badge" },
    { key: "price", header: "Price", type: "currency" },
    { key: "date", header: "Date", type: "date" }
  ],
  rows: [
    { product: "Widget", status: "Active", price: 99.99, date: "2024-01-15" }
  ]
}} />`
      }
    ]
  },

  kv_card: {
    id: "kv_card",
    name: "Key-Value Card",
    description: "Display a single record as a structured card with labeled fields. Perfect for entity details, user profiles, or configuration displays.",
    category: "Data Display",
    phase: 1,
    icon: "IdCard",
    features: [
      "Up to 30 labeled fields",
      "Field types: text, badge, link",
      "Title and subtitle support",
      "Link fields with href support"
    ],
    useCases: [
      "User profile details",
      "Order summary cards",
      "Configuration displays",
      "Entity detail views"
    ],
    sampleData: {
      title: "Customer Profile",
      subtitle: "ID: CUST-12345",
      fields: [
        { label: "Name", value: "Jane Smith", type: "text" },
        { label: "Email", value: "jane@example.com", type: "text" },
        { label: "Status", value: "Premium", type: "badge" },
        { label: "Website", value: "Visit", type: "link", href: "https://example.com" }
      ]
    },
    sampleJson: `{
  "type": "kv_card",
  "id": "customer-profile",
  "data": {
    "title": "Customer Profile",
    "subtitle": "ID: CUST-12345",
    "fields": [
      { "label": "Name", "value": "Jane Smith" },
      { "label": "Status", "value": "Premium", "type": "badge" },
      { "label": "Website", "value": "Visit", "type": "link", "href": "https://example.com" }
    ]
  }
}`,
    props: [
      { name: "data", type: "KVCardData", required: true, description: "Card data with title, subtitle, and fields" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Basic KV Card",
        description: "Simple key-value display",
        code: `<KVCardBlock data={{
  title: "Server Status",
  fields: [
    { label: "Status", value: "Online" },
    { label: "Uptime", value: "99.9%" }
  ]
}} />`
      }
    ]
  },

  stat_group: {
    id: "stat_group",
    name: "Stat Group",
    description: "Display 1-8 KPI metric tiles with optional trend indicators and deltas. Perfect for dashboards and analytics summaries.",
    category: "Data Display",
    phase: 1,
    icon: "BarChart3",
    features: [
      "1-8 metric tiles per group",
      "Delta indicators with up/down/flat",
      "Optional trend labels",
      "Hint text for context"
    ],
    useCases: [
      "Dashboard KPI summaries",
      "Sales metrics display",
      "Performance indicators",
      "Analytics overviews"
    ],
    sampleData: {
      items: [
        { label: "Revenue", value: "$125K", delta: { value: 12, direction: "up", label: "vs last month" }, hint: "Total sales" },
        { label: "Users", value: "8,432", delta: { value: 5.3, direction: "up", label: "vs last week" } },
        { label: "Churn", value: "2.1%", delta: { value: 0.5, direction: "down", label: "vs last month" }, hint: "Monthly churn rate" }
      ]
    },
    sampleJson: `{
  "type": "stat_group",
  "id": "metrics-overview",
  "data": {
    "items": [
      {
        "label": "Revenue",
        "value": "$125K",
        "delta": { "value": 12, "direction": "up", "label": "vs last month" },
        "hint": "Total sales"
      }
    ]
  }
}`,
    props: [
      { name: "data", type: "StatGroupData", required: true, description: "Stat group with metric items" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Dashboard Metrics",
        description: "KPI tiles with trends",
        code: `<StatGroupBlock data={{
  items: [
    { label: "Revenue", value: "$125K", delta: { value: 12, direction: "up" } },
    { label: "Users", value: "8.4K", delta: { value: 5, direction: "up" } }
  ]
}} />`
      }
    ]
  },

  notice: {
    id: "notice",
    name: "Notice",
    description: "Alert banners for info, success, warning, and error states. Also serves as the fallback block for unknown or invalid block types.",
    category: "Content",
    phase: 1,
    icon: "Bell",
    features: [
      "4 variants: info, success, warning, error",
      "Optional title",
      "Message up to 2000 characters",
      "Automatic fallback for invalid blocks"
    ],
    useCases: [
      "Error messages from LLM",
      "Success confirmations",
      "Warning alerts",
      "Information notices"
    ],
    sampleData: {
      variant: "success",
      title: "Operation Completed",
      message: "The data has been successfully processed and saved to the database."
    },
    sampleJson: `{
  "type": "notice",
  "id": "success-msg",
  "data": {
    "variant": "success",
    "title": "Operation Completed",
    "message": "Data processed successfully."
  }
}`,
    props: [
      { name: "data", type: "NoticeData", required: true, description: "Notice content with variant and message" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Success Notice",
        description: "Green success banner",
        code: `<NoticeBlock data={{
  variant: "success",
  title: "Done!",
  message: "Changes saved successfully."
}} />`
      },
      {
        title: "Error Notice",
        description: "Red error banner",
        code: `<NoticeBlock data={{
  variant: "error",
  title: "Error",
  message: "Failed to connect to database."
}} />`
      }
    ]
  },

  markdown: {
    id: "markdown",
    name: "Markdown",
    description: "Render GitHub-flavored markdown content with sanitization. Supports headings, lists, code blocks, tables, and more.",
    category: "Content",
    phase: 1,
    icon: "FileText",
    features: [
      "GitHub-flavored markdown",
      "HTML sanitization",
      "Up to 10,000 characters",
      "Code syntax highlighting"
    ],
    useCases: [
      "Formatted explanations",
      "Documentation content",
      "Rich text responses",
      "Tutorial content"
    ],
    sampleData: {
      content: "# Welcome\\n\\nThis is **bold** and *italic* text.\\n\\n- Item 1\\n- Item 2\\n- Item 3"
    },
    sampleJson: `{
  "type": "markdown",
  "id": "intro-text",
  "data": {
    "content": "# Welcome\\n\\nThis is **bold** and *italic* text."
  }
}`,
    props: [
      { name: "data", type: "MarkdownData", required: true, description: "Markdown content string" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Basic Markdown",
        description: "Simple formatted text",
        code: `<MarkdownBlock data={{
  content: "# Hello\\n\\nThis is **bold** text."
}} />`
      }
    ]
  },

  form_input: {
    id: "form_input",
    name: "Form Input",
    description: "Complete form builder with 15+ field types including text, email, password, select, checkbox, radio, date, and more. Supports validation and multiple layouts.",
    category: "Interactive",
    phase: 2,
    icon: "FormInput",
    features: [
      "15+ field types",
      "Built-in validation",
      "Vertical, horizontal, grid layouts",
      "Up to 50 fields per form",
      "Custom submit/cancel/reset labels"
    ],
    useCases: [
      "User registration forms",
      "Data entry interfaces",
      "Configuration panels",
      "Search filters"
    ],
    sampleData: {
      title: "Contact Form",
      description: "Send us a message",
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
        { name: "email", label: "Email", type: "email", required: true, placeholder: "john@example.com" },
        { name: "message", label: "Message", type: "textarea", required: true, validation: { maxLength: 500 } },
        { name: "priority", label: "Priority", type: "select", options: [{ label: "Low", value: "low" }, { label: "High", value: "high" }] }
      ],
      submitLabel: "Send Message",
      layout: "vertical"
    },
    sampleJson: `{
  "type": "form_input",
  "id": "contact-form",
  "data": {
    "title": "Contact Form",
    "fields": [
      { "name": "name", "label": "Full Name", "type": "text", "required": true },
      { "name": "email", "label": "Email", "type": "email", "required": true },
      { "name": "message", "label": "Message", "type": "textarea", "required": true }
    ],
    "submitLabel": "Send Message"
  }
}`,
    props: [
      { name: "data", type: "FormInputData", required: true, description: "Form configuration with fields" },
      { name: "onAction", type: "(action: 'submit' | 'cancel' | 'reset', payload: FormData) => void", required: true, description: "Form action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Contact Form",
        description: "Basic contact form with validation",
        code: `<FormInputBlock
  data={{
    title: "Contact Us",
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Message", type: "textarea", required: true }
    ]
  }}
  onAction={(action, data) => console.log(action, data)}
/>`
      }
    ]
  },

  button_group: {
    id: "button_group",
    name: "Button Group",
    description: "Action buttons with variants, sizes, and states. Supports icons, loading states, and confirmation dialogs.",
    category: "Interactive",
    phase: 2,
    icon: "MousePointerClick",
    features: [
      "Multiple button variants",
      "Icon support",
      "Loading states",
      "Confirmation dialogs",
      "Disabled states"
    ],
    useCases: [
      "Action toolbars",
      "Confirmation dialogs",
      "Form submissions",
      "Navigation actions"
    ],
    sampleData: {
      actions: [
        { id: "save", label: "Save Changes", variant: "primary", icon: "Save" },
        { id: "cancel", label: "Cancel", variant: "secondary" },
        { id: "delete", label: "Delete", variant: "danger", confirmation: { title: "Confirm Delete", message: "Are you sure?" } }
      ]
    },
    sampleJson: `{
  "type": "button_group",
  "id": "actions",
  "data": {
    "buttons": [
      { "id": "save", "label": "Save", "variant": "primary" },
      { "id": "cancel", "label": "Cancel", "variant": "secondary" }
    ]
  }
}`,
    props: [
      { name: "data", type: "ButtonGroupData", required: true, description: "Button configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: true, description: "Button click handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Action Buttons",
        description: "Common action toolbar",
        code: `<ButtonGroupBlock
  data={{
    buttons: [
      { id: "edit", label: "Edit", variant: "primary" },
      { id: "delete", label: "Delete", variant: "danger", confirm: true }
    ]
  }}
  onAction={(id) => console.log('Clicked:', id)}
/>`
      }
    ]
  },

  tabs: {
    id: "tabs",
    name: "Tabs",
    description: "Tabbed content navigation with horizontal and vertical layouts. Supports disabled tabs, badges, and nested content.",
    category: "Navigation",
    phase: 2,
    icon: "Tabs",
    features: [
      "Horizontal and vertical layouts",
      "Tab badges and icons",
      "Disabled tab support",
      "Nested block content"
    ],
    useCases: [
      "Settings panels",
      "Multi-section content",
      "Product details",
      "Documentation sections"
    ],
    sampleData: {
      tabs: [
        { id: "overview", label: "Overview", content: [{ type: "markdown", id: "ov-md", data: { content: "# Overview\\n\\nProduct details here." } }] },
        { id: "specs", label: "Specifications", badge: "3", content: [{ type: "kv_card", id: "specs-kv", data: { title: "Specs", fields: [{ label: "Weight", value: "1.2kg" }] } }] }
      ],
      defaultTab: "overview"
    },
    sampleJson: `{
  "type": "tabs",
  "id": "product-tabs",
  "data": {
    "tabs": [
      { "id": "overview", "label": "Overview", "content": [...] },
      { "id": "specs", "label": "Specs", "content": [...] }
    ]
  }
}`,
    props: [
      { name: "data", type: "TabsData", required: true, description: "Tab configuration with content" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Tab change handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Product Tabs",
        description: "Tabbed product details",
        code: `<TabsBlock data={{
  tabs: [
    { id: "details", label: "Details", content: [...] },
    { id: "reviews", label: "Reviews", badge: "12", content: [...] }
  ]
}} />`
      }
    ]
  },

  accordion: {
    id: "accordion",
    name: "Accordion",
    description: "Collapsible sections for organizing content. Supports single or multiple open items, custom triggers, and nested blocks.",
    category: "Navigation",
    phase: 2,
    icon: "ChevronsUpDown",
    features: [
      "Single or multiple open items",
      "Custom trigger icons",
      "Nested block content",
      "Disabled sections"
    ],
    useCases: [
      "FAQ sections",
      "Settings categories",
      "Documentation sections",
      "Nested data display"
    ],
    sampleData: {
      items: [
        { id: "general", title: "General Settings", content: [{ type: "markdown", id: "gs-md", data: { content: "General options..." } }] },
        { id: "advanced", title: "Advanced", content: [{ type: "form_input", id: "adv-form", data: { fields: [] } }] }
      ],
      allowMultiple: false
    },
    sampleJson: `{
  "type": "accordion",
  "id": "faq",
  "data": {
    "items": [
      { "id": "q1", "title": "What is this?", "content": [...] },
      { "id": "q2", "title": "How does it work?", "content": [...] }
    ]
  }
}`,
    props: [
      { name: "data", type: "AccordionData", required: true, description: "Accordion items with content" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Accordion toggle handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "FAQ Accordion",
        description: "Collapsible FAQ section",
        code: `<AccordionBlock data={{
  items: [
    { id: "q1", title: "Question 1?", content: [{ type: "markdown", id: "a1", data: { content: "Answer 1" } }] }
  ]
}} />`
      }
    ]
  },

  modal: {
    id: "modal",
    name: "Modal",
    description: "Dialog overlays for focused interactions. Supports forms, confirmations, and rich content with customizable sizing.",
    category: "Interactive",
    phase: 2,
    icon: "Maximize2",
    features: [
      "Small, medium, large sizes",
      "Header with title and close",
      "Footer with actions",
      "Nested block content",
      "Backdrop click to close"
    ],
    useCases: [
      "Form dialogs",
      "Confirmation prompts",
      "Detail views",
      "Wizard steps"
    ],
    sampleData: {
      id: "edit-modal",
      isOpen: false,
      title: "Edit Profile",
      description: "Update your account information",
      content: [{ type: "form_input", id: "edit-form", data: { title: "Profile", fields: [{ name: "name", label: "Name", type: "text" }] } }]
    },
    sampleJson: `{
  "type": "modal",
  "id": "edit-modal",
  "data": {
    "title": "Edit Item",
    "size": "medium",
    "content": [...],
    "footer": [...]
  }
}`,
    props: [
      { name: "data", type: "ModalData", required: true, description: "Modal configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Modal action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Form Modal",
        description: "Modal with form content",
        code: `<ModalBlock data={{
  title: "Edit User",
  size: "medium",
  content: [{ type: "form_input", id: "form", data: { fields: [] } }]
}} />`
      }
    ]
  },

  progress: {
    id: "progress",
    name: "Progress",
    description: "Progress indicators including bars, circular spinners, and step wizards. Supports determinate and indeterminate states.",
    category: "Data Display",
    phase: 2,
    icon: "Loader2",
    features: [
      "Linear and circular progress",
      "Determinate and indeterminate",
      "Step/wizard indicators",
      "Labels and percentages"
    ],
    useCases: [
      "File uploads",
      "Processing status",
      "Multi-step wizards",
      "Loading states"
    ],
    sampleData: {
      type: "linear",
      value: 65,
      max: 100,
      label: "Uploading...",
      showPercentage: true
    },
    sampleJson: `{
  "type": "progress",
  "id": "upload-progress",
  "data": {
    "type": "linear",
    "value": 65,
    "max": 100,
    "label": "Uploading..."
  }
}`,
    props: [
      { name: "data", type: "ProgressData", required: true, description: "Progress configuration" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Upload Progress",
        description: "Linear progress bar",
        code: `<ProgressBlock data={{
  type: "linear",
  value: 65,
  max: 100,
  label: "Uploading..."
}} />`
      }
    ]
  },

  chart: {
    id: "chart",
    name: "Chart",
    description: "Data visualizations including bar, line, area, and pie charts. Built on top of Recharts with responsive sizing.",
    category: "Data Display",
    phase: 2,
    icon: "PieChart",
    features: [
      "Bar, line, area, pie charts",
      "Responsive sizing",
      "Tooltips and legends",
      "Multiple data series"
    ],
    useCases: [
      "Analytics dashboards",
      "Sales reports",
      "Usage statistics",
      "Trend visualization"
    ],
    sampleData: {
      type: "bar",
      title: "Monthly Sales",
      data: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [
          { label: "Sales", data: [4000, 3000, 5000] }
        ]
      }
    },
    sampleJson: `{
  "type": "chart",
  "id": "sales-chart",
  "data": {
    "type": "bar",
    "title": "Monthly Sales",
    "data": [
      { "name": "Jan", "value": 4000 },
      { "name": "Feb", "value": 3000 }
    ]
  }
}`,
    props: [
      { name: "data", type: "ChartData", required: true, description: "Chart configuration with data" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Bar Chart",
        description: "Simple bar chart",
        code: `<ChartBlock data={{
  type: "bar",
  title: "Sales",
  data: [
    { name: "Q1", value: 12000 },
    { name: "Q2", value: 15000 }
  ]
}} />`
      }
    ]
  },

  code: {
    id: "code",
    name: "Code",
    description: "Syntax-highlighted code blocks with copy button and language detection. Supports 20+ programming languages.",
    category: "Content",
    phase: 2,
    icon: "Code",
    features: [
      "20+ language support",
      "Syntax highlighting",
      "Copy to clipboard",
      "Line numbers option"
    ],
    useCases: [
      "Code examples",
      "Configuration files",
      "Terminal output",
      "Documentation"
    ],
    sampleData: {
      content: "function greet(name: string) {\n  return `Hello, ${name}!`;\n}",
      language: "typescript",
      filename: "example.ts",
      showLineNumbers: true
    },
    sampleJson: `{
  "type": "code",
  "id": "example-code",
  "data": {
    "language": "typescript",
    "code": "function greet() { return 'Hello'; }",
    "filename": "example.ts"
  }
}`,
    props: [
      { name: "data", type: "CodeData", required: true, description: "Code content and language" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "TypeScript Example",
        description: "Highlighted TypeScript code",
        code: `<CodeBlock data={{
  language: "typescript",
  code: "const x: number = 42;",
  filename: "example.ts"
}} />`
      }
    ]
  },

  timeline: {
    id: "timeline",
    name: "Timeline",
    description: "Event timeline with vertical or horizontal layouts. Supports icons, timestamps, descriptions, and nested content.",
    category: "Advanced",
    phase: 3,
    icon: "Clock",
    features: [
      "Vertical and horizontal layouts",
      "Event icons and timestamps",
      "Nested content per event",
      "Connectors and styling variants"
    ],
    useCases: [
      "Activity logs",
      "Project milestones",
      "Order history",
      "System events"
    ],
    sampleData: {
      events: [
        { id: "1", title: "Order Placed", timestamp: "2024-01-15 10:30", icon: "ShoppingCart", description: "Order #12345 created" },
        { id: "2", title: "Processing", timestamp: "2024-01-15 11:00", icon: "Package" },
        { id: "3", title: "Shipped", timestamp: "2024-01-16 09:00", icon: "Truck" }
      ]
    },
    sampleJson: `{
  "type": "timeline",
  "id": "order-timeline",
  "data": {
    "items": [
      { "id": "1", "title": "Order Placed", "timestamp": "2024-01-15" },
      { "id": "2", "title": "Shipped", "timestamp": "2024-01-16" }
    ]
  }
}`,
    props: [
      { name: "data", type: "TimelineData", required: true, description: "Timeline events" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Order History",
        description: "E-commerce order timeline",
        code: `<TimelineBlock data={{
  items: [
    { id: "1", title: "Ordered", timestamp: "2024-01-15", icon: "Cart" },
    { id: "2", title: "Shipped", timestamp: "2024-01-16", icon: "Truck" }
  ]
}} />`
      }
    ]
  },

  gallery: {
    id: "gallery",
    name: "Gallery",
    description: "Image galleries with grid layouts, lightbox viewing, and lazy loading. Supports captions and alt text.",
    category: "Advanced",
    phase: 3,
    icon: "Images",
    features: [
      "Grid and masonry layouts",
      "Lightbox viewing",
      "Lazy loading",
      "Captions and alt text"
    ],
    useCases: [
      "Product galleries",
      "Portfolio showcases",
      "Documentation screenshots",
      "Media collections"
    ],
    sampleData: {
      layout: "grid",
      columns: 3,
      images: [
        { url: "https://picsum.photos/400/300", alt: "Product view 1", caption: "Front view" },
        { url: "https://picsum.photos/400/301", alt: "Product view 2", caption: "Side view" }
      ]
    },
    sampleJson: `{
  "type": "gallery",
  "id": "product-gallery",
  "data": {
    "layout": "grid",
    "columns": 3,
    "images": [
      { "src": "https://example.com/img1.jpg", "alt": "View 1" }
    ]
  }
}`,
    props: [
      { name: "data", type: "GalleryData", required: true, description: "Gallery images and layout" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Product Gallery",
        description: "Grid of product images",
        code: `<GalleryBlock data={{
  layout: "grid",
  columns: 3,
  images: [
    { src: "img1.jpg", alt: "View 1" }
  ]
}} />`
      }
    ]
  },

  list: {
    id: "list",
    name: "List",
    description: "Rich list component with icons, actions, descriptions, and various layouts. Supports ordered, unordered, and description lists.",
    category: "Content",
    phase: 3,
    icon: "List",
    features: [
      "Ordered and unordered lists",
      "Icons and badges",
      "Action buttons per item",
      "Nested items support"
    ],
    useCases: [
      "Feature lists",
      "To-do items",
      "Navigation menus",
      "Activity feeds"
    ],
    sampleData: {
      items: [
        { id: "1", label: "Complete setup", icon: "Check", description: "Initial configuration done" },
        { id: "2", label: "Add users", icon: "Users" }
      ]
    },
    sampleJson: `{
  "type": "list",
  "id": "todo-list",
  "data": {
    "items": [
      { "id": "1", "title": "Task 1", "icon": "Check" },
      { "id": "2", "title": "Task 2", "description": "Details here" }
    ]
  }
}`,
    props: [
      { name: "data", type: "ListData", required: true, description: "List items configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Item action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Feature List",
        description: "List with icons and descriptions",
        code: `<ListBlock data={{
  items: [
    { id: "1", title: "Feature A", icon: "Star", description: "Great feature" }
  ]
}} />`
      }
    ]
  },

  breadcrumb: {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Navigation trail showing the path to the current location. Supports icons, dropdowns for collapsed items.",
    category: "Navigation",
    phase: 3,
    icon: "GitBranch",
    features: [
      "Hierarchical navigation",
      "Icons per item",
      "Dropdown for long trails",
      "Click handlers"
    ],
    useCases: [
      "Page navigation",
      "Category hierarchies",
      "Folder paths",
      "Wizard progress"
    ],
    sampleData: {
      items: [
        { id: "home", label: "Home", href: "/" },
        { id: "products", label: "Products", href: "/products" },
        { id: "electronics", label: "Electronics", href: "/products/electronics" },
        { id: "laptop", label: "Laptop Pro", current: true }
      ],
      separator: "chevron"
    },
    sampleJson: `{
  "type": "breadcrumb",
  "id": "nav-trail",
  "data": {
    "items": [
      { "id": "home", "label": "Home", "href": "/" },
      { "id": "products", "label": "Products", "href": "/products" }
    ]
  }
}`,
    props: [
      { name: "data", type: "BreadcrumbData", required: true, description: "Breadcrumb trail items" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Item click handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Navigation Trail",
        description: "Product category breadcrumb",
        code: `<BreadcrumbBlock data={{
  items: [
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Products", href: "/products" }
  ]
}} />`
      }
    ]
  },

  badge_group: {
    id: "badge_group",
    name: "Badge Group",
    description: "Group of status badges with various styles and colors. Useful for showing multiple tags, statuses, or labels.",
    category: "Data Display",
    phase: 3,
    icon: "Tags",
    features: [
      "Multiple badge variants",
      "Custom colors",
      "Dismissible badges",
      "Overflow handling"
    ],
    useCases: [
      "Status indicators",
      "Tag clouds",
      "Label filters",
      "Category badges"
    ],
    sampleData: {
      badges: [
        { id: "1", label: "Active", variant: "success" },
        { id: "2", label: "Premium", variant: "primary" },
        { id: "3", label: "Beta", variant: "warning", removable: true }
      ]
    },
    sampleJson: `{
  "type": "badge_group",
  "id": "status-badges",
  "data": {
    "badges": [
      { "id": "1", "label": "Active", "variant": "success" },
      { "id": "2", "label": "Premium", "variant": "primary" }
    ]
  }
}`,
    props: [
      { name: "data", type: "BadgeGroupData", required: true, description: "Badge configurations" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Badge action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Status Badges",
        description: "Product status indicators",
        code: `<BadgeGroupBlock data={{
  badges: [
    { id: "1", label: "Active", variant: "success" },
    { id: "2", label: "New", variant: "info" }
  ]
}} />`
      }
    ]
  },

  metric_card: {
    id: "metric_card",
    name: "Metric Card",
    description: "Single metric display with sparkline, trend, and context. Perfect for focused KPI presentation.",
    category: "Data Display",
    phase: 3,
    icon: "Activity",
    features: [
      "Sparkline mini-chart",
      "Trend indicator",
      "Comparison value",
      "Custom formatting"
    ],
    useCases: [
      "Focus metric display",
      "Real-time stats",
      "Key indicators",
      "Dashboard highlights"
    ],
    sampleData: {
      label: "Revenue",
      value: "$45,231",
      trend: { direction: "up", value: 12.5 },
      sparkline: [30, 45, 35, 50, 48, 60, 55, 70],
      comparison: "vs last month: +$5,000"
    },
    sampleJson: `{
  "type": "metric_card",
  "id": "revenue-metric",
  "data": {
    "label": "Revenue",
    "value": "$45,231",
    "trend": { "direction": "up", "value": 12.5 }
  }
}`,
    props: [
      { name: "data", type: "MetricCardData", required: true, description: "Metric data with trend" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Revenue Metric",
        description: "Single KPI with trend",
        code: `<MetricCardBlock data={{
  label: "Revenue",
  value: "$45K",
  trend: { direction: "up", value: 12 }
}} />`
      }
    ]
  },

  comparison_table: {
    id: "comparison_table",
    name: "Comparison Table",
    description: "Side-by-side comparison table for products, plans, or features. Includes highlighting and CTAs.",
    category: "Advanced",
    phase: 3,
    icon: "Columns",
    features: [
      "Multiple columns",
      "Feature rows with icons",
      "Highlighted recommendations",
      "Action buttons per column"
    ],
    useCases: [
      "Pricing plans",
      "Product comparisons",
      "Feature matrices",
      "Plan selection"
    ],
    sampleData: {
      title: "Choose Your Plan",
      columns: ["Basic", "Pro"],
      rows: [
        { label: "Users", items: ["5", "Unlimited"] },
        { label: "Storage", items: ["10GB", "100GB"] }
      ],
      highlightColumn: 1
    },
    sampleJson: `{
  "type": "comparison_table",
  "id": "pricing-compare",
  "data": {
    "columns": [
      { "id": "basic", "title": "Basic", "price": "$9/mo" },
      { "id": "pro", "title": "Pro", "price": "$29/mo", "highlighted": true }
    ]
  }
}`,
    props: [
      { name: "data", type: "ComparisonTableData", required: true, description: "Comparison configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Pricing Table",
        description: "Plan comparison",
        code: `<ComparisonTableBlock data={{
  columns: [
    { id: "basic", title: "Basic", price: "$9/mo" },
    { id: "pro", title: "Pro", price: "$29/mo", highlighted: true }
  ]
}} />`
      }
    ]
  },

  json_viewer: {
    id: "json_viewer",
    name: "JSON Viewer",
    description: "Interactive JSON explorer with collapsible nodes, syntax highlighting, and search.",
    category: "Advanced",
    phase: 3,
    icon: "Braces",
    features: [
      "Collapsible nodes",
      "Syntax highlighting",
      "Search functionality",
      "Copy to clipboard"
    ],
    useCases: [
      "API response display",
      "Configuration viewing",
      "Debug output",
      "Data exploration"
    ],
    sampleData: {
      data: { name: "John", age: 30, address: { city: "NYC", zip: "10001" } },
      expanded: true,
      searchable: true
    },
    sampleJson: `{
  "type": "json_viewer",
  "id": "api-response",
  "data": {
    "data": { "name": "John", "age": 30 }
  }
}`,
    props: [
      { name: "data", type: "JsonViewerData", required: true, description: "JSON data to display" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "API Response",
        description: "Display JSON data",
        code: `<JsonViewerBlock data={{
  data: { name: "John", items: [1, 2, 3] }
}} />`
      }
    ]
  },

  diff_viewer: {
    id: "diff_viewer",
    name: "Diff Viewer",
    description: "Side-by-side or inline diff viewer for comparing text or code changes.",
    category: "Advanced",
    phase: 3,
    icon: "GitCompare",
    features: [
      "Side-by-side and inline modes",
      "Syntax highlighting",
      "Line numbers",
      "Change summary"
    ],
    useCases: [
      "Code review",
      "Configuration changes",
      "Document revisions",
      "Audit logs"
    ],
    sampleData: {
      title: "Code Changes",
      original: "const x = 1;",
      modified: "const x = 2;",
      language: "typescript"
    },
    sampleJson: `{
  "type": "diff_viewer",
  "id": "code-diff",
  "data": {
    "mode": "split",
    "changes": [
      { "type": "removed", "content": "old code" },
      { "type": "added", "content": "new code" }
    ]
  }
}`,
    props: [
      { name: "data", type: "DiffViewerData", required: true, description: "Diff content" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Code Diff",
        description: "Show code changes",
        code: `<DiffViewerBlock data={{
  mode: "split",
  changes: [
    { type: "removed", content: "old" },
    { type: "added", content: "new" }
  ]
}} />`
      }
    ]
  },

  kanban: {
    id: "kanban",
    name: "Kanban",
    description: "Task board with draggable columns and cards. Supports swimlanes, WIP limits, and quick actions.",
    category: "Advanced",
    phase: 3,
    icon: "LayoutTemplate",
    features: [
      "Multiple columns",
      "Draggable cards",
      "WIP limits",
      "Quick actions",
      "Swimlane support"
    ],
    useCases: [
      "Project management",
      "Task tracking",
      "Workflow visualization",
      "Sprint boards"
    ],
    sampleData: {
      columns: [
        { id: "todo", title: "To Do", cards: [{ id: "c1", title: "Task 1", priority: "high" }] },
        { id: "inprogress", title: "In Progress", cards: [{ id: "c2", title: "Task 2" }], wipLimit: 3 },
        { id: "done", title: "Done", cards: [] }
      ]
    },
    sampleJson: `{
  "type": "kanban",
  "id": "project-board",
  "data": {
    "columns": [
      { "id": "todo", "title": "To Do", "cards": [...] },
      { "id": "done", "title": "Done", "cards": [] }
    ]
  }
}`,
    props: [
      { name: "data", type: "KanbanData", required: true, description: "Kanban board configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Task Board",
        description: "Simple kanban board",
        code: `<KanbanBlock data={{
  columns: [
    { id: "todo", title: "To Do", cards: [{ id: "1", title: "Task" }] }
  ]
}} />`
      }
    ]
  },

  tree: {
    id: "tree",
    name: "Tree",
    description: "Hierarchical tree view with expandable nodes, icons, and actions. Supports selection and drag-drop.",
    category: "Navigation",
    phase: 3,
    icon: "Network",
    features: [
      "Expandable/collapsible nodes",
      "Icons and badges",
      "Multi-selection",
      "Search/filter",
      "Drag and drop"
    ],
    useCases: [
      "File browsers",
      "Category hierarchies",
      "Org charts",
      "Navigation trees"
    ],
    sampleData: {
      nodes: [
        { id: "1", label: "Root", expanded: true, children: [
          { id: "2", label: "Child 1", icon: "File" },
          { id: "3", label: "Child 2", children: [{ id: "4", label: "Grandchild" }] }
        ]}
      ]
    },
    sampleJson: `{
  "type": "tree",
  "id": "file-tree",
  "data": {
    "nodes": [
      {
        "id": "1",
        "label": "Root",
        "children": [
          { "id": "2", "label": "Child 1" }
        ]
      }
    ]
  }
}`,
    props: [
      { name: "data", type: "TreeData", required: true, description: "Tree node configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "File Tree",
        description: "Hierarchical file browser",
        code: `<TreeBlock data={{
  nodes: [
    { id: "1", label: "src", children: [
      { id: "2", label: "index.ts" }
    ]}
  ]
}} />`
      }
    ]
  },

  carousel: {
    id: "carousel",
    name: "Carousel",
    description: "Content carousel/slider with autoplay, navigation arrows, and indicators. Supports images, cards, or custom content.",
    category: "Advanced",
    phase: 3,
    icon: "GalleryHorizontal",
    features: [
      "Auto-play with pause on hover",
      "Navigation arrows",
      "Dot indicators",
      "Touch/swipe support",
      "Custom slide content"
    ],
    useCases: [
      "Image galleries",
      "Testimonials",
      "Product showcases",
      "Feature highlights"
    ],
    sampleData: {
      items: [
        { id: "1", title: "Welcome", description: "Get started with our platform", content: "Slide 1 content" },
        { id: "2", title: "Features", description: "Explore all capabilities", content: "Slide 2 content" }
      ],
      autoplay: true,
      autoplayDelay: 5000,
      showControls: true,
      showIndicators: true,
      loop: true
    },
    sampleJson: `{
  "type": "carousel",
  "id": "hero-carousel",
  "data": {
    "autoPlay": true,
    "slides": [
      { "id": "1", "content": [...] },
      { "id": "2", "content": [...] }
    ]
  }
}`,
    props: [
      { name: "data", type: "CarouselData", required: true, description: "Carousel slides configuration" },
      { name: "onAction", type: "(action: string, payload?: unknown) => void", required: false, description: "Action handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" }
    ],
    examples: [
      {
        title: "Hero Carousel",
        description: "Auto-playing content slider",
        code: `<CarouselBlock data={{
  autoPlay: true,
  slides: [
    { id: "1", content: [{ type: "markdown", id: "m1", data: { content: "# Welcome" } }] }
  ]
}} />`
      }
    ]
  }
};

export const blockCategories: BlockCategory[] = [
  "Data Display",
  "Interactive",
  "Content",
  "Navigation",
  "Advanced"
];

export const categoryOrder: Record<BlockCategory, number> = {
  "Data Display": 1,
  "Interactive": 2,
  "Content": 3,
  "Navigation": 4,
  "Advanced": 5
};

export function getBlocksByCategory(category: BlockCategory): BlockMeta[] {
  return Object.values(blocksMeta).filter(b => b.category === category);
}

export function getBlocksByPhase(phase: BlockPhase): BlockMeta[] {
  return Object.values(blocksMeta).filter(b => b.phase === phase);
}
