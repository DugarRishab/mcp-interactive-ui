#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addBlockCommand } from './commands/add-block.js';
import { validateCommand } from './commands/validate.js';
import { previewCommand } from './commands/preview.js';
import { generatePromptCommand } from './commands/generate-prompt.js';
import { devCommand } from './commands/dev.js';

const program = new Command();

program
  .name('mcpui')
  .description('CLI for mcp-interactive-ui development')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize mcp-interactive-ui in your project')
  .option('--framework <framework>', 'Framework: react or vue')
  .option('--package-manager <pm>', 'Package manager: npm, pnpm, or yarn')
  .action(initCommand);

program
  .command('add-block')
  .description('Add a new block definition')
  .argument('<name>', 'Block name (e.g., custom_card)')
  .option('--template <template>', 'Template: interactive or read-only')
  .action(addBlockCommand);

program
  .command('validate')
  .description('Validate block definitions against schemas')
  .argument('[path]', 'Path to block definitions directory')
  .option('--fix', 'Auto-fix issues where possible')
  .action(validateCommand);

program
  .command('preview')
  .description('Launch interactive block preview server')
  .option('--port <port>', 'Port for preview server', '3000')
  .action(previewCommand);

program
  .command('generate-prompt')
  .description('Generate LLM system prompt from registry')
  .option('--output <file>', 'Output file path')
  .action(generatePromptCommand);

program
  .command('dev')
  .description('Start development mode with hot reload')
  .option('--port <port>', 'Dev server port', '3000')
  .action(devCommand);

program.parse();
