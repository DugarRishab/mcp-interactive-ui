import { galleryDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const galleryBlock: BlockDefinition<'gallery'> = {
  id: 'gallery',
  type: 'gallery',
  name: 'Gallery',
  description:
    'Display image galleries with grid, masonry, carousel, and list layouts. Includes lightbox support.',
  category: 'layout',
  schema: galleryDataSchema,
  example: {
    title: 'Product Images',
    images: [
      { url: 'https://example.com/img1.jpg', alt: 'Front view', title: 'Front' },
      { url: 'https://example.com/img2.jpg', alt: 'Back view', title: 'Back' },
      { url: 'https://example.com/img3.jpg', alt: 'Side view', title: 'Side' }
    ],
    layout: 'grid',
    columns: 3,
    aspectRatio: 'auto',
    gap: 'md',
    lightbox: true,
    allowDownload: false,
    allowFullscreen: true,
    autoplay: false,
    autoplayDelay: 5000
  },
};
