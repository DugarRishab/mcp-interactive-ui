import { z } from 'zod';

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

export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type GalleryData = z.infer<typeof galleryDataSchema>;
