import { z } from 'zod';

export const modalDataSchema = z.object({
  id: z.string(),
  isOpen: z.boolean().optional(),
  title: z.string(),
  description: z.string().optional(),
  // content is handled separately for recursive blocks
  size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).optional(),
  variant: z.enum(['default', 'alert', 'confirm']).optional(),
  footer: z.object({
    showCloseButton: z.boolean().optional(),
    closeLabel: z.string().optional(),
    actions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      variant: z.enum(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']).optional(),
      primary: z.boolean().optional(),
    })).optional(),
  }).optional(),
  closeOnOverlayClick: z.boolean().optional(),
  closeOnEsc: z.boolean().optional(),
  preventScroll: z.boolean().optional(),
});

export type ModalFooterAction = {
  id: string;
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  primary?: boolean;
};
export type ModalData = z.infer<typeof modalDataSchema>;
