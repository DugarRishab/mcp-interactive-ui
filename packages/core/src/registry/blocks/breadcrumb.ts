import { breadcrumbDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const breadcrumbBlock: BlockDefinition<'breadcrumb'> = {
  id: 'breadcrumb',
  type: 'breadcrumb',
  name: 'Breadcrumb',
  description:
    'Display navigation trail with clickable segments showing the path to the current page.',
  category: 'layout',
  schema: breadcrumbDataSchema,
  example: {
    items: [
      { label: 'Home', href: '/', disabled: false },
      { label: 'Products', href: '/products', disabled: false },
      { label: 'Electronics', href: '/products/electronics', disabled: false },
      { label: 'Laptops', disabled: false }
    ],
    separator: '/',
    showRoot: true
  },
};
