import chalk from 'chalk';
import fs from 'fs-extra';
import { glob } from 'glob';

interface ValidateOptions {
  fix?: boolean;
}

export async function validateCommand(pathArg?: string, _options: ValidateOptions = {}): Promise<void> {
  const blocksDir = pathArg || './src/blocks';

  if (!await fs.pathExists(blocksDir)) {
    console.error(chalk.red(`Blocks directory not found: ${blocksDir}`));
    return;
  }

  console.log(chalk.blue('Validating block definitions...\n'));

  const files = glob.sync('**/*.ts', { cwd: blocksDir }) as string[];
  let errors = 0;
  let warnings = 0;

  for (const file of files) {
    console.log(chalk.gray(`  Checking ${file}...`));
    // Basic validation - check file structure
    try {
      const content = await fs.readFile(`${blocksDir}/${file}`, 'utf-8');
      if (!content.includes('z.object') && !content.includes('z.infer')) {
        warnings++;
        console.log(chalk.yellow(`    ⚠ No Zod schema found`));
      }
    } catch (e) {
      errors++;
      console.log(chalk.red(`    ✗ Error reading file`));
    }
  }

  console.log();
  if (errors === 0 && warnings === 0) {
    console.log(chalk.green('✓ All blocks validated successfully'));
  } else {
    console.log(chalk.yellow(`⚠ Validation complete: ${errors} errors, ${warnings} warnings`));
  }
}
