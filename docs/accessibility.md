# Accessibility (WCAG 2.1 AA)

MCP Interactive UI components are designed with accessibility in mind, following WCAG 2.1 AA guidelines.

## Implemented Features

### ARIA Attributes
- **Accordion**: `aria-expanded`, `aria-controls`, `aria-disabled`, `role="region"`, `aria-labelledby`
- **Tabs**: `role="tab"`, `aria-selected`, `role="tabpanel"`
- **Modal**: `role="dialog"`, `aria-modal="true"`, ESC key handling, focus management
- **Progress**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-busy`
- **DataTable**: `role="table"`, `role="row"`, `role="columnheader"`, `role="cell"`, `scope="col"`
- **FormInput**: `aria-invalid`, `aria-describedby` linking to error/help messages, `role="alert"` on errors
- **Notice**: `role="alert"` for notifications
- **RenderAIContent**: `role="main"`, `role="region"` landmarks

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab navigation follows logical order
- Accordion and Modal support keyboard controls
- Buttons have visible focus states (`focus-visible:ring-*`)

### Focus Management
- Visible focus indicators on all interactive elements
- Focus trap in modal dialogs
- Focus management in accordions and tabs

### Screen Reader Support
- Error messages announced with `aria-live="polite"` and `role="alert"`
- Help text linked to inputs via `aria-describedby`
- Table headers with proper `scope="col"`
- Progress values announced via `aria-valuetext`

### Color Contrast
All components use shadcn/ui color tokens which meet WCAG 2.1 AA contrast requirements:
- Primary text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## Usage

No additional configuration needed. All accessibility features are built-in.

```tsx
// Screen readers will properly announce blocks
<RenderAIContent response={data} />

// Forms have proper validation announcements
<FormInputBlock data={formData} />

// Tables are properly structured
<DataTableBlock data={tableData} />
```
