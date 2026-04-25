import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';

interface AddBlockOptions {
  template?: string;
}

const BLOCK_TEMPLATES = {
  interactive: {
    description: 'Interactive block with user input and actions',
    fields: ['title', 'description', 'actions'],
  },
  'read-only': {
    description: 'Read-only block for displaying data',
    fields: ['title', 'data'],
  },
};

export async function addBlockCommand(name: string, options: AddBlockOptions): Promise<void> {
  const template = options.template || 'read-only';

  if (!BLOCK_TEMPLATES[template as keyof typeof BLOCK_TEMPLATES]) {
    console.error(chalk.red(`Unknown template: ${template}`));
    console.log(chalk.gray('Available templates: interactive, read-only'));
    return;
  }

  // Generate block schema file
  const schemaContent = generateSchemaFile(name, template);

  const blocksDir = './src/blocks';
  await fs.ensureDir(blocksDir);

  const fileName = `${toCamelCase(name)}Block.ts`;
  const filePath = path.join(blocksDir, fileName);

  if (await fs.pathExists(filePath)) {
    console.error(chalk.red(`Block already exists: ${fileName}`));
    return;
  }

  await fs.writeFile(filePath, schemaContent);

  console.log(chalk.green(`✓ Created ${fileName}`));
  console.log(chalk.gray(`  Path: ${filePath}`));
  console.log(chalk.gray(`  Template: ${template}`));
}

function toCamelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}

function generateSchemaFile(name: string, template: string): string {
  const camelName = toCamelCase(name);

  return `import { z } from 'zod';

export const ${camelName}DataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  data: z.record(z.unknown()).default({}),
});

export type ${camelName}Data = z.infer<typeof ${camelName}DataSchema>;
`;
}
