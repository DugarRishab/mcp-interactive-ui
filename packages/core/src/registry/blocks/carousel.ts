import { carouselDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const carouselBlock: BlockDefinition<'carousel'> = {
  id: 'carousel',
  type: 'carousel',
  name: 'Carousel',
  description:
    'Display content carousel with autoplay, navigation controls, and nested blocks.',
  category: 'layout',
  schema: carouselDataSchema,
  example: {
    title: 'Welcome Slides',
    items: [
      { id: 'slide1', title: 'Welcome', description: 'Get started today!' },
      { id: 'slide2', title: 'Features', description: 'Powerful tools at your fingertips.' }
    ],
    autoplay: false,
    autoplayDelay: 5000,
    showControls: true,
    showIndicators: true,
    loop: true,
    transition: 'slide'
  },
};
