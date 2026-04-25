import { z } from 'zod';

export const carouselItemSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  content: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const carouselDataSchema = z.object({
  title: z.string().optional(),
  items: z.array(carouselItemSchema).min(1).max(50),
  autoplay: z.boolean().default(false),
  autoplayDelay: z.number().default(5000),
  showControls: z.boolean().default(true),
  showIndicators: z.boolean().default(true),
  loop: z.boolean().default(true),
  transition: z.enum(['slide', 'fade']).default('slide'),
});

export type CarouselItem = z.infer<typeof carouselItemSchema>;
export type CarouselData = z.infer<typeof carouselDataSchema>;
