import { progressDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const progressBlock: BlockDefinition<'progress'> = {
  id: 'progress',
  type: 'progress',
  name: 'Progress',
  description:
    'Show progress with linear bars, circular indicators, or step workflows. Use for loading states, multi-step processes, or status tracking.',
  category: 'feedback',
  schema: progressDataSchema,
  example: {
    title: 'Upload Progress',
    variant: 'linear',
    value: 65,
    max: 100,
    indeterminate: false,
    showPercentage: true,
    size: 'md',
    color: 'primary',
    label: 'Uploading file...',
    sublabel: '2.5 MB / 4 MB',
  },
};
