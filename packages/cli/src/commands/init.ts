import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

interface InitOptions {
  framework?: string;
  packageManager?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.blue('Initializing mcp-interactive-ui...\n'));

  // Detect framework if not specified
  let framework = options.framework;
  if (!framework) {
    if (fs.existsSync('package.json')) {
      const pkg = await fs.readJson('package.json');
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.react) framework = 'react';
      else if (deps.vue) framework = 'vue';
    }

    if (!framework) {
      const answers = await inquirer.prompt([{
        type: 'list',
        name: 'framework',
        message: 'Which framework?',
        choices: ['react', 'vue'],
        default: 'react'
      }]);
      framework = answers.framework;
    }
  }

  // Detect package manager
  let pm = options.packageManager;
  if (!pm) {
    if (fs.existsSync('pnpm-lock.yaml')) pm = 'pnpm';
    else if (fs.existsSync('yarn.lock')) pm = 'yarn';
    else if (fs.existsSync('package-lock.json')) pm = 'npm';
    else pm = 'npm';
  }

  // Create config file
  const config = {
    framework,
    packageManager: pm,
    blocksDir: './src/blocks',
  };

  await fs.writeJson('.mcpui.json', config, { spaces: 2 });

  console.log(chalk.green(`✓ Initialized for ${framework} with ${pm}`));
  console.log(chalk.gray(`Configuration saved to .mcpui.json`));
}
