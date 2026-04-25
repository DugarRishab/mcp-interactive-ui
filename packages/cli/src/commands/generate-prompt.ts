import chalk from 'chalk';
import fs from 'fs-extra';

interface GeneratePromptOptions {
  output?: string;
}

export async function generatePromptCommand(options: GeneratePromptOptions = {}): Promise<void> {
  const outputFile = options.output || 'llm-prompt.txt';

  console.log(chalk.blue('Generating LLM system prompt...\n'));

  // Load blocks from config or default location
  const blocksDir = './src/blocks';
  let blocks: string[] = [];

  try {
    const files = await fs.readdir(blocksDir);
    blocks = files.filter(f => f.endsWith('.ts')).map(f => f.replace('.ts', ''));
  } catch {
    console.log(chalk.yellow('No blocks directory found, using default prompt'));
  }

  const prompt = generateSystemPrompt(blocks);

  await fs.writeFile(outputFile, prompt);

  console.log(chalk.green(`✓ Generated prompt: ${outputFile}`));
  console.log(chalk.gray(`  Blocks included: ${blocks.length}`));
}

function generateSystemPrompt(blocks: string[]): string {
  return `You are an AI assistant that can respond with structured UI blocks.

Available block types:
${blocks.map(b => `- ${b}: ${getBlockDescription(b)}`).join('\n')}

When you need to use a UI block, respond with a tool call using the appropriate block type and data structure.

For text responses, provide them as regular text content.

For UI elements:
- data_table: Display tabular data with columns and rows
- kv_card: Show key-value pairs in a card format
- form_input: Collect user input with form fields
- button_group: Present actionable buttons
- stat_group: Display statistics with optional deltas
- notice: Show alerts, warnings, info messages
- tabs: Organize content in tab panels
- accordion: Collapsible content sections
- modal: Dialog/poverlay content
- progress: Show progress bars or indicators
- chart: Display data visualizations
- code: Show syntax-highlighted code
- timeline: Event timeline visualization
- gallery: Image galleries and carousels
- list: Ordered, unordered, or checklist items
- breadcrumb: Navigation breadcrumbs
- badge_group: Collection of badges/tags
- metric_card: Single metric with context
- comparison_table: Side-by-side feature comparison
- json_viewer: Interactive JSON tree view
- diff_viewer: Code diff visualization
- kanban: Kanban board for task management
- tree: Hierarchical tree navigation
- carousel: Image/content carousel

Use blocks to create rich, interactive experiences for the user.`;
}

function getBlockDescription(name: string): string {
  const descriptions: Record<string, string> = {
    data_table: 'Display tabular data with columns and rows',
    kv_card: 'Key-value pairs in card format',
    form_input: 'Interactive form with validation',
    button_group: 'Collection of action buttons',
    stat_group: 'Statistics display with deltas',
    notice: 'Alert/warning/info messages',
    tabs: 'Tabbed content organization',
    accordion: 'Collapsible sections',
    modal: 'Dialog overlay',
    progress: 'Progress indicators',
    chart: 'Data visualizations',
    code: 'Code display with highlighting',
    timeline: 'Event timeline',
    gallery: 'Image collection',
    list: 'List items',
    breadcrumb: 'Navigation trail',
    badge_group: 'Badge/tag collection',
    metric_card: 'Single metric display',
    comparison_table: 'Feature comparison',
    json_viewer: 'JSON tree view',
    diff_viewer: 'Code diff view',
    kanban: 'Task board',
    tree: 'Tree navigation',
    carousel: 'Content carousel',
  };
  return descriptions[name] || 'Custom block';
}
